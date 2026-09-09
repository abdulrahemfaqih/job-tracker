"use client";

import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { DownloadSimple, X, Devices, Export } from "@phosphor-icons/react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // 1. Cek apakah sudah running dalam mode PWA / Standalone
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://");
      return Boolean(isStandaloneMode);
    };

    if (checkStandalone()) {
      setIsStandalone(true);
      return;
    }

    // 2. Cek apakah user pernah menutup banner di sesi ini
    const dismissedSession = sessionStorage.getItem("pwa_install_dismissed");
    if (dismissedSession === "true") {
      setIsDismissed(true);
    }

    // 3. Deteksi iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(ua) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIos(isIosDevice);

    // 4. Tangkap event beforeinstallprompt (Chrome Android, Desktop Edge/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!isMounted || isStandalone || isDismissed) {
    return null;
  }

  // Jika browser desktop/android belum mentrigger prompt dan bukan iOS, tetap tampilkan opsi install jika didukung
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
        setIsStandalone(true);
      }
    } else if (isIos) {
      alert(
        "Untuk menginstall di iPhone/iPad: Tap tombol Bagikan (Share) di menu Safari bawah, lalu pilih 'Tambahkan ke Layar Utama' (Add to Home Screen)."
      );
    } else {
      alert(
        "Untuk menginstall di Desktop: Klik ikon install (+) yang ada di sebelah kanan kolom alamat (address bar) browser Anda."
      );
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("pwa_install_dismissed", "true");
  };

  return (
    <div className="bg-surface border border-border-strong rounded-[8px] p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all animate-fadeIn">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-[6px] border border-border bg-bg text-text-primary shrink-0 mt-0.5">
          {isIos ? (
            <Export size={20} weight="bold" />
          ) : (
            <Devices size={20} weight="bold" />
          )}
        </div>

        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-text-primary tracking-tight">
              Install Aplikasi Job Tracker
            </h4>
            <span className="font-mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border border-border bg-bg text-text-secondary">
              PWA
            </span>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
            {isIos ? (
              <span>
                Pasang di Layar Utama iPhone: Tap tombol <strong>Share</strong> di Safari lalu pilih <strong>&quot;Add to Home Screen&quot;</strong>.
              </span>
            ) : (
              <span>
                Buka lebih cepat langsung dari desktop atau layar utama ponsel Anda tanpa perlu mengetik URL di browser.
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleInstallClick}
          className="gap-1.5 text-xs font-medium"
        >
          <DownloadSimple size={14} weight="bold" />
          <span>Install Aplikasi</span>
        </Button>

        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-bg border border-transparent hover:border-border rounded-[4px] transition-colors cursor-pointer"
          title="Tutup pemberitahuan"
          aria-label="Tutup pemberitahuan"
        >
          <X size={14} weight="bold" />
        </button>
      </div>
    </div>
  );
}

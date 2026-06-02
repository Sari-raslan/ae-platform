export class ProAccessManager {
  constructor() {
    this.mode = localStorage.getItem("uaos_mode") || "simulation";
    this.license = localStorage.getItem("uaos_license_key") || "";
  }

  isPro() {
    return this.mode === "pro" && this.license.length >= 8;
  }

  isSimulation() {
    return !this.isPro();
  }

  activate(key) {
    if (!key || key.length < 8) {
      return {
        ok: false,
        message: "Invalid license key"
      };
    }

    this.license = key;
    this.mode = "pro";

    localStorage.setItem("uaos_license_key", key);
    localStorage.setItem("uaos_mode", "pro");

    return {
      ok: true,
      message: "Pro mode activated"
    };
  }

  resetToSimulation() {
    this.license = "";
    this.mode = "simulation";

    localStorage.removeItem("uaos_license_key");
    localStorage.setItem("uaos_mode", "simulation");
  }

  guard(actionName) {
    if (this.isPro()) {
      return {
        allowed: true
      };
    }

    return {
      allowed: false,
      message:
        `${actionName} is disabled in Simulation Mode. Upgrade to Pro to unlock real saving, export, production, and commercial use.`
    };
  }

  status() {
    return {
      mode: this.isPro() ? "pro" : "simulation",
      isPro: this.isPro(),
      isSimulation: this.isSimulation(),
      licensePreview: this.license ? this.license.slice(0, 4) + "****" : ""
    };
  }
}

export const proAccessManager = new ProAccessManager();

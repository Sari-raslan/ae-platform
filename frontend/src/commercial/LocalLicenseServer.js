export class LocalLicenseServer {
  constructor() {
    this.licenses = JSON.parse(localStorage.getItem("uaos_licenses") || "[]");
    this.active = localStorage.getItem("uaos_active_license") || "";
  }

  generateLicense(email = "beta@uaos.local") {
    const key =
      "UAOS-" +
      Math.random().toString(36).slice(2, 6).toUpperCase() +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase() +
      "-" +
      Math.random().toString(36).slice(2, 6).toUpperCase();

    const license = {
      key,
      email,
      plan: "beta",
      status: "active",
      createdAt: new Date().toISOString()
    };

    this.licenses.unshift(license);
    localStorage.setItem("uaos_licenses", JSON.stringify(this.licenses));

    return license;
  }

  activate(key) {
    const found = this.licenses.find((l) => l.key === key);

    if (!found) {
      return { ok: false, message: "License not found locally" };
    }

    this.active = key;
    localStorage.setItem("uaos_active_license", key);

    return { ok: true, message: "License activated", license: found };
  }

  status() {
    return {
      active: this.active,
      activated: Boolean(this.active),
      licenses: this.licenses
    };
  }
}

export const localLicenseServer = new LocalLicenseServer();

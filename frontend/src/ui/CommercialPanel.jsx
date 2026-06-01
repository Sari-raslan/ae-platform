import { useState } from "react";
import { licenseManager } from "../system/LicenseManager";
import { purchaseManager } from "../system/PurchaseManager";

export default function CommercialPanel() {
  const [license, setLicense] = useState(licenseManager.status());
  const [key, setKey] = useState("");
  const purchase = purchaseManager.status();

  function activate() {
    const result = licenseManager.activate(key);
    setLicense(licenseManager.status());
    alert(result.message);
  }

  return (
    <section className="panel">
      <h2>Commercial Distribution</h2>

      <div className="grid">
        <div className="box">
          <h3>Purchase</h3>
          <p>Product: {purchase.product}</p>
          <p>Price: {purchase.price}</p>
          <p>Purchase Enabled: {String(purchase.purchaseEnabled)}</p>
          <button onClick={() => purchaseManager.openPurchasePage()}>
            Open Download / Release Page
          </button>
        </div>

        <div className="box">
          <h3>License</h3>
          <p>Activated: {String(license.activated)}</p>
          <p>Key: {license.key || "None"}</p>

          <input
            placeholder="Enter license key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />

          <div className="toolbar">
            <button onClick={activate}>Activate</button>
            <button onClick={() => {
              licenseManager.deactivate();
              setLicense(licenseManager.status());
            }}>
              Deactivate
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

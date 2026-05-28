function cloudStatus() {
  return {
    ok: true,
    cloud: false,
    sync: false,
    deployReady: true,
    mode: "LOCAL_WORKSTATION"
  };
}

module.exports = {
  cloudStatus
};

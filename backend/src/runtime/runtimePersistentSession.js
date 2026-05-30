let session = {
  setName: null,
  transport: null,
  styles: [],
  updatedAt: null,
};

export function saveRuntimeSession(data = {}) {
  session = {
    ...session,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return session;
}

export function loadRuntimeSession() {
  return {
    ok: true,
    session,
    generatedAt: new Date().toISOString(),
  };
}

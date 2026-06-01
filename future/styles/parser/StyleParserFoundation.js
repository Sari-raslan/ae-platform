export function createStyleParserFoundation() {

  const supported = [
    ".sty",
    ".prs",
    ".set",
    ".mid"
  ];

  function parse(file) {

    return {
      ok: true,
      file,
      supported,
      generatedAt:
        new Date().toISOString(),
    };
  }

  return {
    parse,
  };
}

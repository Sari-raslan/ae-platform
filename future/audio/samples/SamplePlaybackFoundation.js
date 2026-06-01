export function createSamplePlaybackFoundation() {

  const samples = [];

  function load(name, url) {

    samples.push({
      name,
      url,
      loaded: false,
    });
  }

  function snapshot() {

    return {
      count: samples.length,
      samples,
      generatedAt:
        new Date().toISOString(),
    };
  }

  return {
    load,
    snapshot,
  };
}

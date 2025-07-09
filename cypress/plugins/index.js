module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // Example: customize browser launch args
  on("before:browser:launch", (browser = {}, launchOptions) => {
    if (browser.name === "chrome") {
      launchOptions.args.push("--disable-dev-shm-usage");
      return launchOptions;
    }
  });
};

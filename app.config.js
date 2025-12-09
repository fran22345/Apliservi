export default ({ config }) => ({
    ...config,
    name: "apliservi",
    slug: "apliservi",
    version: "1.0.0",

    android: {
        ...config.android,
        package: "com.apliservi1.apliservi1", // tu packageName real
         googleServicesFile:'./google-services.json',
    },
});

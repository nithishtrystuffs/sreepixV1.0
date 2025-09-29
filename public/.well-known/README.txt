This folder should contain 'assetlinks.json' when you build the Android TWA (Trusted Web Activity).

How to produce it:
1) Deploy your site (e.g., https://sreepix.vercel.app or a custom domain over HTTPS).
2) On your machine, install Bubblewrap: npm i -g @bubblewrap/cli
3) Initialize from your live manifest: bubblewrap init --manifest=https://YOUR_DOMAIN/manifest.json
   - Choose a package name (e.g., com.sreepix.app) and app name.
   - Bubblewrap will generate an assetlinks.json for your app signing key.
4) Copy the generated assetlinks.json into this directory at:
   public/.well-known/assetlinks.json
5) Redeploy. Verify https://YOUR_DOMAIN/.well-known/assetlinks.json serves the file.

Once in place, Chrome verifies the relationship and your TWA will run full-screen without URL bar.

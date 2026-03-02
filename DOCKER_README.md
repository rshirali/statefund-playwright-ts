# Playwright Docker Execution Guide -- State Fund (CA)

This document explains how to **build, run, and manage** Playwright
tests inside Docker for the `statefund-playwright-ts` project.

------------------------------------------------------------------------

## 1. Build the Docker Image

``` bash
docker build -t statefund-playwright-ts .
```

**Notes** - `-t` assigns the image name (`statefund-playwright-ts`). - The
`.` indicates the current directory as the build context.

------------------------------------------------------------------------

## 2. Run Tests (Headless Chrome)

``` bash
docker run --rm -it \
  -e BASE_URL=https://www.statefundca.com \
  -e SCREENSHOT=true \
  -e HEADLESS=true \
  -v "$PWD/playwright-report:/app/playwright-report" \
  -v "$PWD/test-results:/app/test-results" \
  statefund-playwright-ts \
  npx playwright test --project=chromium
```

  Flag                   Description
  ---------------------- ------------------------------------------------
  `--rm`                 Removes container after run
  `-it`                  Interactive terminal mode
  `-e`                   Passes environment variables
  `-v`                   Mounts host directories for report and results
  `--project=chromium`   Runs Chrome only

------------------------------------------------------------------------

## 3. Run Headed (Visible Browser)

``` bash
docker run --rm -it \
  -e BASE_URL=https://www.statefundca.com \
  -e SCREENSHOT=true \
  -v "$PWD/playwright-report:/app/playwright-report" \
  -v "$PWD/test-results:/app/test-results" \
  statefund-playwright-ts \
  npx playwright test --project=chromium --headed
```

> 🪟 Requires X11 forwarding, VS Code Dev Containers, or similar for
> visible browser windows.

------------------------------------------------------------------------

## 4. Run All Browsers

``` bash
docker run --rm -it \
  -e BASE_URL=https://www.statefundca.com \
  -e SCREENSHOT=true \
  -e HEADLESS=true \
  -v "$PWD/playwright-report:/app/playwright-report" \
  -v "$PWD/test-results:/app/test-results" \
  statefund-playwright-ts \
  npx playwright test
```

------------------------------------------------------------------------

## 📊 5. View Test Report

``` bash
docker run --rm -it \
  -v "$PWD/playwright-report:/app/playwright-report" \
  statefund-playwright-ts \
  npx playwright show-report
```

Then open `playwright-report/index.html` locally in your browser.

------------------------------------------------------------------------

## 🔍 6. Inspect Inside Container

``` bash
docker run -it --entrypoint /bin/bash statefund-playwright-ts
```

Then you can run:

``` bash
npx playwright test --list
npx playwright show-report
```

------------------------------------------------------------------------

## 🧹 7. Cleanup

``` bash
docker container prune -f
docker image prune -f
docker system prune -a -f   # removes everything
```

------------------------------------------------------------------------

## 8. Save / Share the Image

``` bash
docker save -o statefund-playwright-ts.tar statefund-playwright-ts
docker load -i statefund-playwright-ts.tar
```

------------------------------------------------------------------------

## 9. Verify Image

``` bash
docker images statefund-playwright-ts
docker history statefund-playwright-ts
```

------------------------------------------------------------------------

## ☁️ 10. (Optional) Push to Docker Hub

``` bash
docker tag statefund-playwright-ts your-dockerhub-username/statefund-playwright-ts:latest
docker push your-dockerhub-username/statefund-playwright-ts:latest
```

------------------------------------------------------------------------

## Summary

### Common Docker Commands

  --------------------------------------------------------------------------------------------------------------------------------------------
  Step                 Purpose                              Command
  -------------------- ------------------------------------ ----------------------------------------------------------------------------------
  Build                Create image                         `docker build -t statefund-playwright-ts .`

  Run Chrome           Run only Chrome tests                `docker run --rm -it statefund-playwright-ts npx playwright test --project=chromium`

  Run All              Run all browser tests                `docker run --rm -it statefund-playwright-ts npx playwright test`

  Report               Open report in browser               `docker run --rm -it statefund-playwright-ts npx playwright show-report`

  Clean                Remove unused stuff                  `docker system prune -a -f`
  --------------------------------------------------------------------------------------------------------------------------------------------

------------------------------------------------------------------------

> **Tip:** For CI/CD pipelines, this Docker image can be prebuilt and
> reused across environments --- no Node.js or Playwright installation
> is needed on the host.

------------------------------------------------------------------------

**Maintainer:** Rajeev S. Shirali

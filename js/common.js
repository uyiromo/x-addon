{
    /*
     *
     *  Mute / Block ボタン
     *
     */
    function doMute() {
        let dropdown = document.querySelector('div[data-testid="Dropdown"]');
        if (dropdown && dropdown.children.length >= 3) {
            let muteMenu = dropdown.children[2];
            muteMenu.click();
        }
    }

    function doBlockConfirm() {
        let confirmDiv1 = document.querySelector(
            'button[data-testid="confirmationSheetConfirm"]');
        let confirmDiv2 =
            document.querySelector('div[data-testid="confirmationSheetConfirm"]');
        let confirmDiv = confirmDiv1 ? confirmDiv1 : confirmDiv2;

        confirmDiv.click();
    }

    function doBlock() {
        let div = document.querySelector('div[data-testid="block"]');
        div.click();

        setTimeout(doBlockConfirm, 100);
    }

    function newBtn(img) {
        let ua = window.navigator.userAgent.toLowerCase();

        let btn = document.createElement('img');
        btn.role = "button";
        btn.src = ua.includes("chrome") ? chrome.runtime.getURL(img)
            : browser.runtime.getURL(img);
        btn.style.height = "20px";

        return btn;
    }

    function addButton(tweet) {
        chrome.storage.local.get('buttons', (result) => {
            if (result.buttons === true) {
                // Get caret button
                let caret1 = tweet.querySelector('button[data-testid="caret"]');
                let caret2 = tweet.querySelector('div[data-testid="caret"]');
                let caret = caret1 ? caret1 : caret2;
                if (!caret) {
                    return;
                }

                // blank
                caret.parentElement.appendChild(newBtn("img/blank.png"));

                // mute
                let muteBtn = newBtn("img/mute.png");
                muteBtn.addEventListener("click", () => {
                    caret.click();
                    setTimeout(doMute, 100);
                });
                caret.parentElement.appendChild(muteBtn);

                // block
                let blockBtn = newBtn("img/block.png");
                blockBtn.addEventListener("click", () => {
                    caret.click();
                    setTimeout(doBlock, 100);
                });
                caret.parentElement.appendChild(blockBtn);
            }
        })
    }


    /*
     *
     * analytics
     *
     */
    function hideAnalytics(tweet) {
        chrome.storage.local.get('hideAnalytics', (result) => {
            if (result.hideAnalytics === true) {
                tweet.querySelectorAll('a[href$="/analytics"]')
                    .forEach(href => href.parentElement.style.display = "none");
            }
        });
    }

    /*
     *
     * Like column message
     *
     */
    function hideLikeColumnMsg() {
        chrome.storage.local.get('hideLikeColumnMsg', (result) => {
            if (result.hideLikeColumnMsg === true) {
                document.body.querySelectorAll('div[aria-live="polite"][role="status"]')
                    .forEach(div => div.style.display = "none");
            }
        });
    }


    let XPATH_TWEET = 'article[data-testid="tweet"]';

    function modTweet(tweet) {
        if (!tweet.getAttribute("modified")) {
            hideAnalytics(tweet);
            //muteTweet(tweet);
            //replaceHref(tweet);
            addButton(tweet);
            tweet.setAttribute("modified", "true");
        }
    }

    // Already Loaded Nodes
    document.body.querySelectorAll(XPATH_TWEET).forEach(t => modTweet(t));

    // Future Loaded Nodes
    let observer = new MutationObserver((mutations) => {
        hideLikeColumnMsg();
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                t = node.querySelector(XPATH_TWEET);
                if (t) {
                    modTweet(t);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
    });


}



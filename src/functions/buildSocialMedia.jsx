// import React from "react";
import twitterImage from "/img/logos/twitter-logo.png";
import discordImage from "/img/logos/discord-logo.png";

// INTERNAL: add social media links UL via HTML
export function buildSocialMedia() {

    let twitterUrl = "https://twitter.com/cryptopoker_nft";
    let discordUrl = "https://twitter.com/tomtranmer";

    let socialHtml = "<ul class='social-links'>\
                        <li><a href="+twitterUrl+" target=blank><img src="+twitterImage+" /></a></li>\
                        <li class='disabled'><a href="+discordUrl+" target=blank><img src="+discordImage+" /></a></li>\
                    </ul>";

    return socialHtml;
}
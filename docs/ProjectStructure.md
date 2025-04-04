## 📂 Structure du projet

📂 **Voolk/**
    
- 📂 **docs/**
    - `BotConfig.md`
    - `Features.md`
    - `ProjectStructure.md`
    - `README.md`
    
- 📂 **img/**
    - `discord_profile.png`
    - `github_logo.png`
    
- 📂 **src/**
    - 📂 **commands/**
        - 📂 **slash/**
            - `addRSS.js`
            - `clearMsg.js`
        - 📂 **text/**
            - `rule.js`
        - `slashCommandHandler.js`
        - `textCommandHandler.js`
    - 📂 **config/**
        - `commands.json`
        - `rssFeeds.json`
        - `rules.json`
    - 📂 **events/**
        - `autoRole.js`
        - `dynamicVoiceChannel.js`
        - `eventHandler.js`
        - `globalEventHandler.js`
    - 📂 **utils/**
        - `saveRSSfeed.js`
        - `serverDataHandler.js`
    - `deploy-commands.js`
    - `index.js`
    
- `.gitignore`
- `LICENSE.txt`
- `package.json`
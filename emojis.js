const fs = require("fs");
const axios = require("axios");
const colors = require("colors");
const readlineSync = require("readline-sync");
const moment = require("moment");
const path = require("path");
const packageJson = require("./package.json");

const configPath = "./config.json";
let config = require(configPath);

const saveConfig = (config) => {
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};

const askToken = async () => {
  console.clear();
  console.log(`
███████╗███╗   ███╗ ██████╗      ██╗██╗███████╗
██╔════╝████╗ ████║██╔═══██╗     ██║██║██╔════╝
█████╗  ██╔████╔██║██║   ██║     ██║██║███████╗
██╔══╝  ██║╚██╔╝██║██║   ██║██   ██║██║╚════██║
███████╗██║ ╚═╝ ██║╚██████╔╝╚█████╔╝██║███████║
╚══════╝╚═╝     ╚═╝ ╚═════╝  ╚════╝ ╚═╝╚══════╝
                                                `);
  let token = readlineSync.question(colors.cyan("Por favor, insira o token: "));
  while (!(await validateToken(token))) {
    console.log(colors.red("Token inválido. Por favor, insira novamente."));
    token = readlineSync.question(colors.cyan("Por favor, insira o token: "));
  }
  return token;
};

const askGuildId = async () => {
  console.clear();
  console.log(`
███████╗███╗   ███╗ ██████╗      ██╗██╗███████╗
██╔════╝████╗ ████║██╔═══██╗     ██║██║██╔════╝
█████╗  ██╔████╔██║██║   ██║     ██║██║███████╗
██╔══╝  ██║╚██╔╝██║██║   ██║██   ██║██║╚════██║
███████╗██║ ╚═╝ ██║╚██████╔╝╚█████╔╝██║███████║
╚══════╝╚═╝     ╚═╝ ╚═════╝  ╚════╝ ╚═╝╚══════╝
                                                `);
  let guildId = readlineSync.question(
    colors.cyan("Por favor, insira o ID da guild (Servidor): ")
  );
  while (!(await validateGuildId(config.token, guildId))) {
    console.log(
      colors.red("ID da guild (Servidor) inválido. Por favor, insira novamente.")
    );
    guildId = readlineSync.question(
      colors.cyan("Por favor, insira o ID da guild (Servidor): ")
    );
  }
  return guildId;
};

const validateToken = async (token) => {
  try {
    const response = await axios.get("https://discord.com/api/v9/users/@me", {
      headers: { Authorization: token },
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const validateGuildId = async (token, guildId) => {
  try {
    const response = await axios.get(
      `https://discord.com/api/v9/guilds/${guildId}`,
      {
        headers: { Authorization: token },
      }
    );
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

const clearConsole = () => {
  console.clear();
  console.log(`
███████╗███╗   ███╗ ██████╗      ██╗██╗███████╗
██╔════╝████╗ ████║██╔═══██╗     ██║██║██╔════╝
█████╗  ██╔████╔██║██║   ██║     ██║██║███████╗
██╔══╝  ██║╚██╔╝██║██║   ██║██   ██║██║╚════██║
███████╗██║ ╚═╝ ██║╚██████╔╝╚█████╔╝██║███████║
╚══════╝╚═╝     ╚═╝ ╚═════╝  ╚════╝ ╚═╝╚══════╝
                                                `);
};

const deleteAllEmojis = async () => {
  console.clear();
  const emojisDir = path.join(__dirname, "emojis");

  try {
    await fs.promises.access(emojisDir);
    const files = await fs.promises.readdir(emojisDir);
    if (files.length > 0) {
      console.log(
        `[${moment().format(
          "DD-MM-YYYY HH:mm:ss"
        )}] Limpando diretório de emojis...`
      );
      await Promise.all(
        files.map((file) => fs.promises.unlink(path.join(emojisDir, file)))
      );
      console.log(
        colors.green(
          `[${moment().format(
            "DD-MM-YYYY HH:mm:ss"
          )}] Todos os emojis foram removidos.`
        )
      );
    } else {
      console.log(
        colors.yellow(
          `[${moment().format(
            "DD-MM-YYYY HH:mm:ss"
          )}] Não há emojis para remover.`
        )
      );
    }
  } catch (error) {
    console.error(
      colors.red(
        `[${moment().format(
          "DD-MM-YYYY HH:mm:ss"
        )}] Erro ao limpar emojis: ${error}`
      )
    );
  }
};

const mainMenu = async () => {
  clearConsole();
  console.log(
    colors.yellow.bold(
      `Versão (Utilize a opção 5 para verificar se há atualizações): ${
        packageJson.version
      }.`
    )
  );
  console.log(
    colors.cyan.bold(
      `ID da Guild Configurada: ${config.guildId || "Não configurado."}`
    )
  );
  console.log(
    colors.magenta.bold(
      `Token Configurado: ${
        config.token ? "Configurado." : "Não configurado."
      }`
    )
  );
  console.log(
    colors.green.bold(
      `Feito por: ${packageJson.author};\nRepositório: ${
        packageJson.repository
      }`
    )
  );

  console.log(
    colors.cyan(
      `
  Escolha uma opção:
  [ 1 ] Trocar/Configurar ID da Guild;
  [ 2 ] Trocar/Configurar Token;
  [ 3 ] Iniciar o processo de download de emojis;
  [ 4 ] Limpar diretório de emojis;
  [ 5 ] Verificar se há atualizações;
  [ 6 ] Fechar o programa.
  `
    )
  );

  const option = readlineSync.questionInt("Digite: ");

  switch (option) {
    case 1:
      config.guildId = await askGuildId();
      const guildIdValid = await validateGuildId(config.token, config.guildId);

      console.clear();
    
      if (guildIdValid) {
        saveConfig(config);
        console.log(colors.green("ID da guild (Servidor) salvo com sucesso!"));
      } else {
        console.log(colors.red("ID da guild (Servidor) inválido. Não foi salvo."));
      }
      break;
    
    case 2:
      config.token = await askToken();
      const tokenValid = await validateToken(config.token);

      console.clear();
    
      if (tokenValid) {
        saveConfig(config);
        console.log(colors.green("Token salvo com sucesso!"));
      } else {
        console.log(colors.red("Token inválido. Não foi salvo."));
      }
    break;
    case 3:
      if (config.token && config.guildId) {
        await downloadEmojis();
      } else {
        console.clear();
        console.log(
          colors.yellow(
            `[${moment().format(
              "DD-MM-YYYY HH:mm:ss"
            )}] É necessário configurar o Token e o ID da Guild primeiro.`
          )
        );
      }
      break;
    case 4:
      await deleteAllEmojis();
      break;
    case 5:
      handleUpdates();
      break;
    case 6:
      console.log(
        colors.yellow(
          `[${moment().format("DD-MM-YYYY HH:mm:ss")}] Fechando o programa...`
        )
      );

      console.clear();
      process.exit(0);
      break;
    default:
    console.clear();
    console.log(
        colors.red(
          `[${moment().format(
            "DD-MM-YYYY HH:mm:ss"
          )}] Opção inválida. Por favor, escolha uma opção válida.`
        )
      );
  }

  console.log(
    colors.yellow(
      `[${moment().format(
        "DD-MM-YYYY HH:mm:ss"
      )}] Voltando para o menu principal em 7 segundos...`
    )
  );
  await new Promise((resolve) => setTimeout(resolve, 7000));
  mainMenu();
};


const downloadEmojis = async () => {
  clearConsole();
  console.log(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Iniciando o processo de download de emojis...\n`);

  let tokenValid = false;
  let guildIdValid = false;

  while (!tokenValid || !guildIdValid) {
    if (!config.token) {
      config.token = await askToken();
      saveConfig(config);
    }

    if (!config.guildId) {
      config.guildId = await askGuildId();
      saveConfig(config);
    }

    tokenValid = await validateToken(config.token);
    guildIdValid = await validateGuildId(config.token, config.guildId);

    if (!tokenValid) {
      console.log(colors.red("Token inválido. Por favor, verifique e tente novamente."));
      config.token = "";
      saveConfig(config);
    }

    if (!guildIdValid) {
      console.log(colors.red("ID da guild (Servidor) inválido. Por favor, verifique e tente novamente."));
      config.guildId = "";
      saveConfig(config);
    }
  }

  const emojisDir = path.join(__dirname, "emojis");

  try {
    await fs.promises.access(emojisDir);
  } catch (error) {
    await fs.promises.mkdir(emojisDir);
  }

  const headers = { 'Authorization': config.token };

  const startTime = new Date();

  try {
    const response = await axios.get(`https://discord.com/api/v9/guilds/${config.guildId}/emojis`, { headers });

    if (response.status !== 200) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    const emojis = response.data;
    const totalEmojis = emojis.length;

    console.log(colors.cyan(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] O servidor tem ${totalEmojis} emojis.\n`));

    if (totalEmojis === 0) {
      console.log(colors.yellow(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Não há emojis para baixar.`));
      return;
    }

    let downloadedCount = 0;
    let failedCount = 0;
    let pngCount = 0;
    let gifCount = 0;

    for (let i = 0; i < emojis.length; i++) {
      const emoji = emojis[i];
      const filename = `${emoji.name}.${emoji.animated ? 'gif' : 'png'}`;
      const url = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`;

      try {
        const response = await axios.get(url, { responseType: 'arraybuffer', headers });
        await fs.promises.writeFile(path.join(emojisDir, filename), response.data);
        downloadedCount++;

        if (emoji.animated) {
          gifCount++;
        } else {
          pngCount++;
        }

        console.log(colors.green(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Baixado ${filename}`));

        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        failedCount++;
        console.error(colors.red(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Falha ao baixar ${filename}: ${error.message}`));
      }
    }

    const endTime = new Date();
    const totalTime = endTime - startTime;

    const hours = Math.floor(totalTime / 3600000);
    const minutes = Math.floor((totalTime % 3600000) / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    const milliseconds = totalTime % 1000;

    console.log(colors.cyan(`\n[${moment().format('DD-MM-YYYY HH:mm:ss')}] Processo de download concluído:`));
    console.log(colors.green(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Total de emojis baixados: ${downloadedCount}`));
    console.log(colors.green(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Total de falhas: ${failedCount}`));
    console.log(colors.green(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Emojis PNG: ${pngCount}`));
    console.log(colors.green(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Emojis GIF: ${gifCount}`));
    console.log(colors.green(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Tempo total decorrido: ${hours} horas, ${minutes} minutos, ${seconds} segundos e ${milliseconds} milissegundos.`));

  } catch (error) {
    console.error(colors.red(`[${moment().format('DD-MM-YYYY HH:mm:ss')}] Erro ao obter emojis do servidor: ${error.message}`));
  }
};

const handleUpdates = () => {
  console.clear();
  console.log("Verificando atualizações...");
  console.log("Nenhuma atualização encontrada.");
};

const initialize = async () => {
  let tokenValid = false;
  let guildIdValid = false;

  while (!tokenValid || !guildIdValid) {
    if (!config.token) {
      config.token = await askToken();
      saveConfig(config);
    }

    if (!config.guildId) {
      config.guildId = await askGuildId();
      saveConfig(config);
    }

    tokenValid = await validateToken(config.token);
    guildIdValid = await validateGuildId(config.token, config.guildId);

    if (!tokenValid) {
      console.log(colors.red("Token inválido. Por favor, verifique e tente novamente."));
      config.token = "";
      saveConfig(config);
    }

    if (!guildIdValid) {
      console.log(colors.red("ID da guild (Servidor) inválido. Por favor, verifique e tente novamente."));
      config.guildId = "";
      saveConfig(config);
    }
  }

  console.log(colors.green("Token e ID da guild (Servidor) validados com sucesso."));
  mainMenu();
};

initialize();
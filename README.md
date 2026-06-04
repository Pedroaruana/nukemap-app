# NUKEMAP APP

[![Vercel](https://img.shields.io/badge/demo-vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://nukemap-app.vercel.app)
[![License](https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge)](LICENSE)

App de simulação nuclear que fiz pra estudar React Native + Expo. Inspirado no nukemap.

🌐 **Demo online:** https://nukemap-app.vercel.app

## o que tem

- mapa interativo com varias cidades
- 17 bombas nucleares historicas (Little Boy, Fat Man, Tsar Bomba...)
- escolhe explodir no ar ou no chão
- slider de altitude pra air burst
- calcula mortes, feridos e fallout baseado na densidade da cidade
- animação da explosão + som de sirene + tremida na tela
- toque no mapa pra escolher onde detonar
- usa o GPS pra detonar onde voce está

## como rodar

```bash
npm install
npx expo start
```

Ai escaneia o QR Code com o Expo Go no celular.

### versão web

```bash
npx expo start --web
```

Ou acessa direto o deploy: https://nukemap-app.vercel.app

A versão web usa Leaflet (OpenStreetMap) e o mobile usa o Google Maps. O resto do código é igual.

## stack

- React Native + Expo (SDK 54)
- TypeScript
- react-native-maps (mobile)
- react-leaflet (web)
- expo-audio, expo-haptics, expo-location

## screenshots

![1](assets/images/1.jpg)
![2](assets/images/2.jpg)
![3](assets/images/3.jpg)
![4](assets/images/4.jpg)

## aviso

É só pra estudo e diversão. As contas são aproximadas, não use isso pra nada sério.

---

feito por Pedro Aruana — [github.com/Pedroaruana](https://github.com/Pedroaruana)

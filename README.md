# ☢️ NUKEMAP APP

[![Demo](https://img.shields.io/badge/demo-vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://nukemap-app.vercel.app)
![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge)

App mobile de simulação de impacto nuclear que fiz pra estudar React Native, mapas e animações. Inspirado no site NUKEMAP.

> 🌐 **[Ver demo online →](https://nukemap-app.vercel.app)**
>
> Roda no browser (Leaflet/OpenStreetMap) e no celular (Google Maps). Mesmo código, mapa diferente por plataforma.

---

## Funcionalidades

### Mapa e localização
- 57 cidades do mundo pré-configuradas com população e densidade real
- Toca no mapa pra escolher qualquer ponto como alvo
- Botão de GPS pra detonar na sua localização

### Arsenal (17 armas)
Desde o menor artefato nuclear já criado até a Tsar Bomba:
- Davy Crockett (0.02 KT), W54 SADM, Little Boy, Fat Man, B61-12, Trident II, Tsar Bomba (50 MT) e mais
- Cada arma tem um modelo 3D diferente girando na tela (fiz com View puro, sem lib de 3D)
- Gravity bomb, esfera (Fat Man), MIRV cluster, Tsar

### Simulação
- Escolha obrigatória: **no ar** (mais destruição) ou **no solo** (mais fallout radioativo)
- Slider de altitude pra air burst com altura ótima calculada
- Raios calculados com formula real (raiz cúbica do kt)
- Calcula mortes com base na área de cada zona × densidade da cidade
- Cratera visível no mapa em ground burst
- Fallout em forma de gota seguindo a direção do vento

### UX
- Animação de explosão com flash, tremida na tela, fireball e shockwave
- Sirene antes de explodir + boom + rumble
- Haptics sincronizado com a explosão
- Timeline mostrando o que acontece a cada segundo
- Comparações ("equivale a X bombas de Hiroshima", "X estádios do Maracanã")
- Painel minimizável pra ver o mapa depois de detonar

---

## Stack

| | |
|---|---|
| Framework | React Native 0.81 + Expo SDK 54 |
| Roteamento | Expo Router |
| Mapa (mobile) | react-native-maps (Google Maps satélite) |
| Mapa (web) | react-leaflet (OpenStreetMap) |
| Áudio | expo-audio |
| Localização | expo-location |
| Linguagem | TypeScript 5.9 strict |

---

## Como rodar

```bash
git clone https://github.com/Pedroaruana/nukemap-app.git
cd nukemap-app
npm install
npx expo start
```

Escaneia o QR Code com o **Expo Go** no celular.

Para rodar no browser:
```bash
npx expo start --web
```

---

## Screenshots

![1](assets/images/1.jpg)
![2](assets/images/2.jpg)
![3](assets/images/3.jpg)
![4](assets/images/4.jpg)

---

## Aviso

Esse app é só pra fins educacionais e entretenimento. Os cálculos são aproximações, nada aqui representa capacidade real de qualquer país.

---

Feito por **Pedro Aruana** — [github.com/Pedroaruana](https://github.com/Pedroaruana)

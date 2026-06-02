// Modelos 3D de armas nucleares renderizados com primitivos do React Native
// (sem dependência externa de 3D — apenas Views + transforms).
// Cada formato é uma silhueta estilizada da arma real:
//   gravity → cilindro alongado tipo Little Boy / B83
//   sphere  → bomba esférica tipo Fat Man
//   tsar    → corpo gordo com nose arredondado tipo Tsar Bomba
//   mirv    → cluster de cones reentry vehicles tipo W76 / Satan

import React from "react";
import { View } from "react-native";
import type { BombShape } from "../data/weapons";

interface Props {
  shape: BombShape;
  color: string;
}

export default function Bomb3D({ shape, color }: Props) {
  if (shape === "gravity") {
    return (
      <View style={{ alignItems: "center" }}>
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: 7, borderRightWidth: 7, borderBottomWidth: 10,
          borderLeftColor: "transparent", borderRightColor: "transparent",
          borderBottomColor: color,
        }} />
        <View style={{
          width: 14, height: 36,
          backgroundColor: color,
          shadowColor: color, shadowOpacity: 0.9, shadowRadius: 8,
        }}>
          <View style={{ position: "absolute", top: 6, left: 0, right: 0, height: 1.5, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <View style={{ position: "absolute", top: 14, left: 0, right: 0, height: 1.5, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <View style={{ position: "absolute", top: 22, left: 0, right: 0, height: 1.5, backgroundColor: "rgba(0,0,0,0.4)" }} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: -3 }}>
          <View style={{ width: 0, height: 0, borderBottomWidth: 12, borderRightWidth: 10, borderBottomColor: "transparent", borderRightColor: color }} />
          <View style={{ width: 0, height: 0, borderBottomWidth: 12, borderLeftWidth: 10, borderBottomColor: "transparent", borderLeftColor: color }} />
        </View>
      </View>
    );
  }

  if (shape === "sphere") {
    return (
      <View style={{ alignItems: "center" }}>
        <View style={{
          width: 38, height: 38, borderRadius: 19,
          backgroundColor: color,
          shadowColor: color, shadowOpacity: 1, shadowRadius: 12,
        }}>
          <View style={{ position: "absolute", top: 4, left: 6, width: 14, height: 10, borderRadius: 7, backgroundColor: "rgba(255,255,255,0.35)" }} />
          <View style={{ position: "absolute", top: 12, right: 4, width: 3, height: 3, borderRadius: 1.5, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <View style={{ position: "absolute", bottom: 12, left: 6, width: 3, height: 3, borderRadius: 1.5, backgroundColor: "rgba(0,0,0,0.4)" }} />
        </View>
        <View style={{ flexDirection: "row", marginTop: -4 }}>
          <View style={{ width: 0, height: 0, borderBottomWidth: 8, borderRightWidth: 6, borderBottomColor: "transparent", borderRightColor: color }} />
          <View style={{ width: 4 }} />
          <View style={{ width: 0, height: 0, borderBottomWidth: 8, borderLeftWidth: 6, borderBottomColor: "transparent", borderLeftColor: color }} />
        </View>
      </View>
    );
  }

  if (shape === "tsar") {
    return (
      <View style={{ alignItems: "center" }}>
        <View style={{ width: 18, height: 14, borderTopLeftRadius: 9, borderTopRightRadius: 9, backgroundColor: color }} />
        <View style={{
          width: 22, height: 32,
          backgroundColor: color,
          shadowColor: color, shadowOpacity: 1, shadowRadius: 14,
        }}>
          <View style={{ position: "absolute", top: 5, left: 0, right: 0, height: 2, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <View style={{ position: "absolute", top: 14, left: 0, right: 0, height: 2, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <View style={{ position: "absolute", top: 23, left: 0, right: 0, height: 2, backgroundColor: "rgba(0,0,0,0.4)" }} />
          <View style={{ position: "absolute", top: 3, left: 2, width: 4, height: 24, backgroundColor: "rgba(255,255,255,0.25)" }} />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", marginTop: -3 }}>
          <View style={{ width: 0, height: 0, borderBottomWidth: 11, borderRightWidth: 12, borderBottomColor: "transparent", borderRightColor: color }} />
          <View style={{ width: 0, height: 0, borderBottomWidth: 11, borderLeftWidth: 12, borderBottomColor: "transparent", borderLeftColor: color }} />
        </View>
      </View>
    );
  }

  // MIRV — cluster de cones reentry vehicles
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 1 }}>
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 22,
          borderLeftColor: "transparent", borderRightColor: "transparent",
          borderBottomColor: color, opacity: 0.55,
          transform: [{ scaleY: 0.85 }],
        }} />
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 32,
          borderLeftColor: "transparent", borderRightColor: "transparent",
          borderBottomColor: color,
          shadowColor: color, shadowOpacity: 1, shadowRadius: 10,
        }} />
        <View style={{
          width: 0, height: 0,
          borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 22,
          borderLeftColor: "transparent", borderRightColor: "transparent",
          borderBottomColor: color, opacity: 0.55,
          transform: [{ scaleY: 0.85 }],
        }} />
      </View>
      <View style={{
        width: 32, height: 6, borderRadius: 3,
        backgroundColor: color, opacity: 0.8, marginTop: 1,
        shadowColor: color, shadowOpacity: 0.8, shadowRadius: 6,
      }} />
      <View style={{ width: 36, height: 3, borderRadius: 2, backgroundColor: color, opacity: 0.5, marginTop: 1 }} />
    </View>
  );
}

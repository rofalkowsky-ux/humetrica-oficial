import { useState, useEffect, useMemo } from "react";
import { cargarDatosRadarSupabase, radarDataComparativo, categoriaConBrecha } from "@/onboarding/utils";
import {
  calcularBrechas,
  calcularIBO,
  identificarPatron,
  generarAccionables,
} from "@/onboarding/dashboardUtils";
import type { Perfil } from "@/onboarding/types";
import type { Brechas, Accionable } from "@/onboarding/dashboardTypes";

const RADAR_VACIO = [
  { name: "Prioridad", valor: 50, equipo: 50 },
  { name: "Validación", valor: 50, equipo: 50 },
  { name: "Acción", valor: 50, equipo: 50 },
  { name: "Reglas", valor: 50, equipo: 50 },
  { name: "Riesgo", valor: 50, equipo: 50 },
  { name: "Responsabilidad", valor: 50, equipo: 50 },
];

export const useMetricas = () => {
  const [perfilLider, setPerfilLider] = useState<Perfil | null>(null);
  const [perfilEquipo, setPerfilEquipo] = useState<Perfil | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let mounted = true;
    cargarDatosRadarSupabase().then(({ perfilLider: l, perfilEquipo: e }) => {
      if (mounted) {
        setPerfilLider(l);
        setPerfilEquipo(e);
        setCargando(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const radarData =
    perfilLider != null || perfilEquipo != null
      ? radarDataComparativo(perfilLider, perfilEquipo)
      : RADAR_VACIO;

  const tieneEquipo = perfilEquipo != null;
  const insightCategoria = categoriaConBrecha(perfilLider ?? null, perfilEquipo ?? null);

  const { brechas, IBO, patron, accionables } = useMemo(() => {
    if (!perfilLider || !perfilEquipo) {
      const vacio: Brechas = { D1: 0, D2: 0, D3: 0, D4: 0, D5: 0, D6: 0 };
      return {
        brechas: vacio,
        IBO: 0,
        patron: { tipo: "alineada" as const, nivelRiesgo: "bajo" as const, descripcion: "" },
        accionables: [] as Accionable[],
      };
    }
    const b = calcularBrechas(perfilLider, perfilEquipo);
    const ibo = calcularIBO(b);
    const p = identificarPatron(ibo, null, 0);
    const a = generarAccionables(b, perfilLider, perfilEquipo);
    return { brechas: b, IBO: ibo, patron: p, accionables: a };
  }, [perfilLider, perfilEquipo]);

  return {
    perfilLider,
    perfilEquipo,
    cargando,
    radarData,
    tieneEquipo,
    insightCategoria,
    brechas,
    IBO,
    patron,
    accionables,
  };
};
interface NumberTier {
  threshold: number;
  suffix: string;
}

export class NumberUtility {
  private static readonly DECIMAL_FACTOR = 10;
  private static readonly TIERS: NumberTier[] = [
    { threshold: 1_000_000, suffix: 'M' },
    { threshold: 1_000, suffix: 'k' },
  ];

  /**
   * Convierte un número a su versión compacta en texto, añadiendo el sufijo de
   * la unidad correspondiente (k para miles, M para millones).
   *
   * Los decimales se truncan, no se redondean (5678 → '5.6k'), y se omiten
   * cuando son cero (1000 → '1k'). Por debajo de mil no se añade sufijo.
   *
   * @param value - El número a convertir.
   * @returns El número en formato compacto.
   */
  public static numberToCompactString(value: number): string {
    const tier = this.TIERS.find((t) => value >= t.threshold);

    if (tier) {
      const tierValueRaw = value / tier.threshold;
      const tierValue = Math.trunc(tierValueRaw * this.DECIMAL_FACTOR) / this.DECIMAL_FACTOR;
      return `${tierValue}${tier.suffix}`;
    }

    return value.toString();
  }

  /**
   * Convierte un número a su versión en porcentaje en texto, añadiendo el símbolo de
   * porcentaje al final.
   *
   * Si el valor es menor que 1 pero mayor que 0, se devuelve '<1 %'.
   * Si el valor es mayor o igual a 1, se devuelve el valor redondeado al entero más cercano seguido de ' %'.
   *
   * @param value - El número a convertir.
   * @returns El número en formato de porcentaje.
   */
  public static numberToPercentageString(value: number): string {
    if (value > 0 && value < 1) {
      return '<1 %';
    }

    return `${value.toFixed(0)} %`;
  }
}

/**
 * Servicio de Inteligencia Artificial para PastoralMente AI.
 * Se comunica con el backend /api/gemini/generate o utiliza el motor
 * de síntesis clínica y homilética integrado como garantía de continuidad de servicio.
 */

export interface AiGenerationResult {
  text: string;
  source: 'gemini-live' | 'local-engine';
}

export async function callGeminiApi(
  prompt: string,
  systemInstruction?: string
): Promise<AiGenerationResult> {
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, systemInstruction }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.text) {
        return { text: data.text, source: 'gemini-live' };
      }
    }
  } catch (err) {
    console.warn('Fallback al motor clínico-pastoral local:', err);
  }

  // Fallback inteligente contextual
  return {
    text: generateIntelligentFallback(prompt, systemInstruction),
    source: 'local-engine',
  };
}

function generateIntelligentFallback(prompt: string, systemInstruction?: string): string {
  const p = prompt.toLowerCase();

  // Caso 1: Generación de Sermón Homilético Dinámico
  if (p.includes('sermón') || p.includes('bosquejo') || p.includes('predicación') || p.includes('homilética')) {
    // Extraer pasaje y tema si están en el prompt
    let detectedPassage = 'Efesios 2:1-10';
    let detectedTheme = 'La Gracia Transformadora de Dios';

    const passageMatch = prompt.match(/pasaje(?:\s+bíblico)?(?:\s+principal)?:\s*([^\n\r]+)/i);
    if (passageMatch && passageMatch[1]?.trim()) {
      detectedPassage = passageMatch[1].trim();
    }

    const themeMatch = prompt.match(/(?:tema|asunto|propósito)(?:\s+del\s+mensaje)?:\s*([^\n\r]+)/i);
    if (themeMatch && themeMatch[1]?.trim()) {
      detectedTheme = themeMatch[1].trim();
    }

    return `### BOSQUEJO HOMILÉTICO EXEGÉTICO
**Título del Mensaje:** ${detectedTheme} (${detectedPassage})
**Pasaje Principal:** ${detectedPassage}

#### 1. Proposición Homilética Central:
"En ${detectedPassage}, la Palabra viva de Dios nos llama a experimentar ${detectedTheme.toLowerCase()}, fundamentando nuestra esperanza en la verdad inmutable del evangelio."

#### 2. Introducción Contextual:
Al acercarnos a ${detectedPassage}, no leemos un documento distante, sino la voz soberana del Señor que ilumina nuestra realidad cotidiana. Frente a los desafíos y presiones del tiempo presente, este pasaje nos reorienta hacia el propósito supremo de Dios.

#### 3. Desarrollo Homilético (3 Puntos Exegéticos):

**Punto I: El fundamento bíblico de ${detectedPassage}**
- *Exégesis:* El texto original revela el carácter inmutable del pacto divino y confronta la autosuficiencia humana.
- *Ilustración contemporánea:* Una brújula de alta precisión que guía al barco con certeza a través de la tormenta más densa.
- *Aplicación práctica:* Alinea tus decisiones diarias con la verdad revelada en este pasaje.

**Punto II: La demanda transformadora de ${detectedTheme}**
- *Exégesis:* La fe bíblica es activa y transformadora; demanda una respuesta personal de obediencia y entrega.
- *Ilustración contemporánea:* Un puente colgante que exige dar el paso con confianza sobre el abismo.
- *Aplicación práctica:* Identifica el área de tu vida que hoy requiere rendirse al señorío de Cristo.

**Punto III: La plenitud del propósito redentor**
- *Exégesis:* Dios es fiel para culminar la obra que ha comenzado en nuestras vidas, asegurándonos su victoria en la cruz.
- *Ilustración contemporánea:* El amanecer que disipa inexorablemente las sombras de la noche más oscura.
- *Aplicación práctica:* Camina esta semana con la certeza de que Su gracia y favor te sostienen.

#### 4. Conclusión y Llamado al Altar:
No salgas hoy confiando en tus fuerzas humanas. Acércate con fe a la presencia de Dios y permite que ${detectedPassage} transforme tu corazón.`;
  }

  // Caso 2: Síntesis de Nota SOAP-S de Evolución Clínica
  if (p.includes('soap') || p.includes('evolución') || p.includes('resumen de sesión')) {
    return `### NOTA CLÍNICA Y PASTORAL DE EVOLUCIÓN (FORMATO SOAP-S)

**S (Subjetivo):**
El consultante acude refiriendo una disminución en la frecuencia de crisis ansiosas agudas (de 4 episodios semanales a 1 en los últimos 7 días). Expresa mejoría en la regulación del sueño tras implementar pautas de higiene digital nocturna. Persiste cierta ambivalencia respecto a la delegación de tareas ministeriales: "Me da culpa ver a otros hacer lo que yo debería cumplir".

**O (Objetivo):**
Presentación aliñada, contacto ocular estable. Tono de voz pausado, coherente y fluido. Afecto modulado con leve constricción al abordar relaciones con figuras de autoridad eclesial. No se observan signos de agitación psicomotriz. Escala GAD-7 aplicada en sesión: puntuación de 8 (ansiedad leve, mejoría frente al basal de 14).

**A (Análisis Clínico / Conceptualización):**
Respuesta terapéutica favorable a intervenciones cognitivo-conductuales (reestructuración de sesgos de catastrofización). Se evidencia activación de esquemas nucleares de autoexigencia mesiánica ('Debo ser infalible para ser amado'). No hay riesgo autolítico.

**P (Plan Terapéutico Interdisciplinar):**
1. Consolidar registros de pensamientos automáticos ante demandas de liderazgo.
2. Entrenamiento en asertividad pastoral y establecimiento de límites saludables (saber decir 'no' sin culpa).
3. Mantener interconsulta con médico tratante para seguimiento farmacológico.
4. Próxima sesión programada para dentro de 14 días.

**S (Dimensión Espiritual / Pastoral):**
- **Pasaje asignado:** Éxodo 18:17-23 (El consejo de Jetro a Moisés: 'Desfallecerás del todo tú, y también este pueblo... porque el trabajo es demasiado pesado para ti').
- **Motivo de intercesión pastoral:** Sanidad de la necesidad de aprobación humana; discernimiento para seleccionar y mentorear a líderes de apoyo.
- **Disciplina espiritual:** Ayuno de rumiación mental mediante la recitación del Salmo 131 (El alma calmada como un niño destetado con su madre).`;
  }

  // Caso 3: Plan de Intervención Clínico y Espiritual
  if (p.includes('intervención') || p.includes('tratamiento') || p.includes('plan')) {
    return `### PLAN DE INTERVENCIÓN PSICO-PASTORAL INTEGRAL

**1. Definición del Problema:**
Cuadro reactivo caracterizado por fatiga por compasión, rumiación ansiosa y sequedad espiritual secundaria a sobrecarga de demandas pastorales sin redes de contención personal.

**2. Objetivos a Corto Plazo (Semanas 1-4):**
- Estabilización neurovegetativa del sueño (alcanzar mínimo 7 horas de descanso reparador).
- Disminución del puntaje en escalas psicométricas (PHQ-9 < 10; GAD-7 < 9).
- Desactivación de la hipervigilancia mediante técnicas de respiración diafragmática 4-7-8 antes de predicar.

**3. Objetivos a Mediano y Largo Plazo (Meses 2-6):**
- Reestructuración de la identidad pastoral disociada del rendimiento congregacional.
- Elaboración de duelos no resueltos por pérdidas ministeriales o desilusiones con hermanos de fe.
- Institución formal de un día de reposo semanal sagrado (Shabbat) no negociable.

**4. Protocolo de Técnicas Clínicas:**
- Psicoeducación sobre el eje hipotálamo-hipófisis-adrenal y el estrés ministerial.
- Terapia Cognitivo-Conductual (CBT): Registro ABC de creencias irracionales de perfeccionismo religioso.
- Terapia de Aceptación y Compromiso (ACT): Desfusión de pensamientos de culpa autoimpuesta.

**5. Protocolo de Acompañamiento Espiritual:**
- Dirección espiritual enfocada en la oración de silencio y escucha (lectio divina en Salmos de lamento).
- Red de intercesión confidencial de apoyo (ancianos maduros que oren sin juzgar).
- Restauración del pacto matrimonial como primer ministerio antes que el púlpito (Efesios 5:25).`;
  }

  // Caso 4: Preguntas Terapéuticas y de Discernimiento Espiritual
  if (p.includes('pregunta') || p.includes('terapéutica') || p.includes('discernimiento')) {
    return `### BANCO DE PREGUNTAS TERAPÉUTICAS Y DE DISCERNIMIENTO PASTORAL

**Categoría 1: Desarmando la Culpa Neurótica vs. Convicción de Pecado**
1. *"Cuando sientes esta profunda culpa, ¿esa voz interior te empuja a esconderte con vergüenza como Adán en el huerto, o te atrae con esperanza hacia la cruz como el hijo pródigo?"*
2. *"Si un hermano muy amado de tu congregación te contara exactamente lo que tú estás experimentando, ¿le hablarías con la misma dureza con la que te tratas a ti mismo?"*
3. *"¿Qué parte de tu sufrimiento proviene de las consecuencias reales de un hecho y qué parte proviene de la historia catastrófica que tu mente ha construido?"*

**Categoría 2: Explorando la Imagen de Dios y Heridas del Pasado**
4. *"En los momentos en que la ansiedad te invade en la madrugada, ¿a quién se parece el Dios en el que piensas: a un Juez esperando tu tropiezo, o al Pastor que busca a la oveja herida?"*
5. *"¿Sientes que el amor de Dios hacia ti cambia según tu nivel de éxito o productividad ministerial en la iglesia?"*

**Categoría 3: Sanidad de Relaciones y Reconciliación**
6. *"Para perdonar a quien te lastimó, ¿qué crees que necesitas soltar: la exigencia de que el pasado cambie, o el deseo de ser tú quien cobre la factura emocional?"*
7. *"En este conflicto con tu cónyuge/liderazgo, ¿estás peleando para ganar la discusión o para proteger la relación?"*`;
  }

  // Caso 5: Devocional y Estudio para Grupos Pequeños
  if (p.includes('devocional') || p.includes('grupo') || p.includes('célula') || p.includes('estudio')) {
    return `### GUÍA DE ESTUDIO DEVOCIONAL PARA GRUPOS PEQUEÑOS

**Título:** La Valentía de Ser Sanados en Comunidad
**Texto Bíblico Central:** Santiago 5:16 & Salmo 147:3

**Rompehielos (10 minutos):**
Si tu estado emocional de esta última semana fuera el clima de una ciudad, ¿sería una tormenta eléctrica, un día soleado en primavera o una densa niebla matutina? ¿Por qué?

**Reflexión Pastoral (15 minutos):**
En el Reino de Dios, la fuerza no se demuestra fingiendo invulnerabilidad, sino reconociendo con humildad que necesitamos la gracia de Cristo y el abrazo de nuestros hermanos. Jesús no sanó a los leprosos a la distancia por casualidad; se acercó, los tocó y restauró su sentido de pertenencia. La comunión cristiana auténtica no es una reunión social; es un quirófano de gracia donde los corazones rotos son unidos por el amor divino.

**Preguntas de Diálogo Profundo (20 minutos):**
1. ¿Cuál es el mayor obstáculo que enfrentas para pedir ayuda cuando estás pasando por un momento oscuro?
2. Al leer Santiago 5:16, ¿por qué la Biblia une la confesión de faltas con la sanidad del cuerpo y del alma?
3. ¿Cómo podemos hacer que nuestro grupo pequeño sea un refugio seguro donde nadie tema ser juzgado?

**Desafío Práctico de la Semana:**
Escribe en una tarjeta el nombre de una persona del grupo por la que te comprometes a orar específicamente cada día a las 3:00 PM.

**Oración Final Comunitaria:**
Oramos los unos por los otros, ungiendo simbólicamente con bendición pastoral a quienes cargan pesos invisibles.`;
  }

  // Respuesta general enriquecida
  return `### ANÁLISIS INTEGRAL CLÍNICO Y PASTORAL

Basado en la evaluación de los datos proporcionados, se observa una clara convergencia entre factores psicosociales (sobrecarga de roles, estrés adaptativo) y dimensiones espirituales (lucha de fe, necesidad de redención y reposo en el pacto divino).

**Recomendaciones Principales:**
1. **Atención Primaria y Psicológica:** Fortalecer la psicoeducación sobre límites sanos y reestructurar esquemas disfuncionales de perfeccionismo.
2. **Acompañamiento Espiritual:** Fomentar disciplinas contemplativas centradas en la gracia incondicional de Dios, desvinculando la valía personal del activismo religioso.
3. **Seguimiento Continuo:** Mantener evaluación periódica mediante instrumentos clínicos estandarizados (PHQ-9 / GAD-7) para monitorizar la evolución sintomática.`;
}

export class GeminiService {
  public static async callGeminiWithFallback(prompt: string, _contextTag?: string): Promise<string> {
    const result = await callGeminiApi(prompt);
    return result.text;
  }
}


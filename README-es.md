<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shedi-ai/shedi)
[![Twitter](https://img.shields.io/badge/Twitter-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/shedi_ai)
[![Website](https://img.shields.io/badge/Website-0EA5E9?style=for-the-badge&logo=googlechrome&logoColor=white)](https://shedi.ai)

</div>

## 🌐 Shedi AI

Shedi AI es una herramienta de automatización web con IA que se ejecuta en tu navegador. Es una alternativa gratuita a OpenAI Operator, con opciones flexibles de modelos de lenguaje (LLM) y un sistema multiagente.

⬇️ Descarga [Shedi AI desde Chrome Web Store](https://shedi.ai) gratis

👏 Únete a la comunidad en [X](https://x.com/shedi_ai) | [X](https://x.com/shedi_ai)

❤️ ¿Te encanta Shedi AI? ¡Danos una estrella 🌟 y ayúdanos a correr la voz!

## 🔥 ¿Por qué usar Shedi AI?

¿Buscas un potente agente de navegador con IA sin el precio de $200/mes de OpenAI Operator? **Shedi AI**, como extensión de Chrome, ofrece capacidades avanzadas de automatización web mientras tú tienes el control total.

- **100% Gratis** - Sin suscripciones ni costos ocultos. Solo instala y usa tus propias claves de API, pagando únicamente por lo que tú consumas.
- **Enfoque En Privacidad** - Todo se ejecuta en tu navegador local. Tus credenciales permanecen contigo y nunca se comparten con ningún servicio en la nube.
- **Opciones Flexibles de LLM** - Conéctate con tu proveedor de LLM preferido con la libertad de elegir diferentes modelos para diferentes agentes.
- **Totalmente Open Source** - Transparencia total en cómo se automatiza tu navegador. Sin procesos ocultos ni cajas negras.

> **Nota:** Actualmente ofrecemos soporte para OpenAI, Anthropic, Gemini, Ollama y proveedores personalizados compatibles con OpenAI, próximamente se ofrecerá soporte a más proveedores.


## 📊 Funciones Clave

- **Sistema Multiagente**: Agentes de IA especializados colaboran para realizar flujos de trabajo de navegador complejos
- **Panel Lateral Interactivo**: Interfaz de chat intuitiva con actualizaciones de estado en tiempo real
- **Automatización de Tareas**: Automatiza sin esfuerzo tareas repetitivas en distintos sitios web
- **Preguntas de Seguimiento**: Haz preguntas de seguimiento sobre tareas completadas
- **Historial de Conversaciones**: Accede y gestiona fácilmente el historial de interacciones con tu agente de IA
- **Soporte de Múltiples LLM**: Conéctate a tus proveedores de LLM preferidos y asigna distintos modelos a diferentes agentes


## 🚀 Inicio Rápido

1. **Instala desde Chrome Web Store** (Versión Estable):
   * Visita la [página de Shedi AI en Chrome Web Store](https://shedi.ai)
   * Haz clic en el botón "Añadir a Chrome"
   * Confirma la instalación cuando se te solicite

> **Nota Importante**: Para acceder a las funciones más recientes, instala desde ["Instalar Última Versión Manualmente"](#-instalar-última-versión-manualmente) abajo, ya que la versión de Chrome Web Store puede tardar en actualizarse debido al proceso de revisión.

2. **Configurar Modelos de Agente**:
   * Haz clic en el icono de Shedi AI ubicado en la barra de herramientas para abrir el panel lateral
   * Haz clic en el icono de `Settings` (arriba a la derecha)
   * Agrega tus claves de API del LLM
   * Elige qué modelo usar para cada agente (Navigator, Planner)

## 🔧 Instalar Última Versión Manualmente

Para obtener la versión más reciente con todas las funciones nuevas:

1. **Descargar**
    * Descarga el archivo `shedi-ai.zip` más reciente desde la [página de lanzamientos](https://github.com/shedi-ai/shedi/releases) oficial en GitHub.

2. **Instalar**:
    * Extrae el archivo `shedi-ai.zip`.
    * Abre `chrome://extensions/` en Chrome
    * Habilita el `Modo de desarrollador` (arriba a la derecha)
    * Haz clic en `Cargar extensión sin empaquetar` (arriba a la izquierda)
    * Selecciona la carpeta descomprimida de `shedi-ai`.

3. **Configurar Modelos de Agente**
    * Haz clic en el icono de Shedi AI en la barra de herramientas para abrir el panel lateral
    * Haz clic en el icono de `Settings` (arriba a la derecha).
    * Agrega tus claves de API del LLM
    * Elige qué modelo usar para cada agente (Navigator, Planner)

4. **Actualizar**:
    * Descarga el archivo `shedi-ai.zip` más reciente desde la página de lanzamientos.
    * Extrae y reemplaza los archivos existentes de Shedi AI con los nuevos.
    * Ve a `chrome://extensions/` en Chrome y haz clic en el icono de actualizar en la tarjeta de Shedi AI.

## 🛠️ Compilar desde el Código Fuente

Si prefieres compilar Shedi AI por ti mismo, sigue estos pasos:

1. **Requisitos Previos**:
   * [Node.js](https://nodejs.org/) (v22.12.0 o superior)
   * [pnpm](https://pnpm.io/installation) (v9.15.1 o superior)

2. **Clonar el Repositorio**:
   ```bash
   git clone https://github.com/shedi-ai/shedi.git
   cd shedi-ai
   ```

3. **Instalar Dependencias**:
   ```bash
   pnpm install
   ```

4. **Compilar la Extensión**:
   ```bash
   pnpm build
   ```

5. **Cargar la Extensión**:
   * La extensión compilada estará en la carpeta `dist`
   * Sigue los pasos de instalación de la sección Instalar Última Versión Manualmente para cargar la extensión a tu navegador

6. **Modo Desarrollador** (opcional):
   ```bash
   pnpm dev
   ```

## 🤖 Eligiendo tus Modelos

Shedi AI te permite configurar distintos modelos LLM para cada agente para equilibrar costo y rendimiento. Aquí están las configuraciones recomendadas:

### Mejor Rendimiento
- **Planner**: Claude Sonnet 4
  - Mejores capacidades de razonamiento y planificación
- **Navigator**: Claude Haiku 3.5
  - Eficiente para tareas de navegación web
  - Buen equilibrio entre rendimiento y costo

### Configuración Económica
- **Planner**: Claude Haiku or GPT-4o
  - Rendimiento razonable a menor costo
  - Puede requerir más iteraciones para tareas complejas
- **Navigator**: Gemini 2.5 Flash or GPT-4o-mini
  - Ligero y económico
  - Adecuado para tareas básicas de navegación

### Modelos Locales
- **Opciones de Configuración**:
  - Usa Ollama u otros proveedores compatibles con OpenAI para ejecutar modelos localmente
  - Sin costos de API y con privacidad total, sin datos que salgan de tu máquina

- **Modelos Recomendados**:
  - **Qwen3-30B-A3B-Instruct-2507**
  - **Falcon3 10B**
  - **Qwen 2.5 Coder 14B**
  - **Mistral Small 24B**
  - [Últimos resultados de pruebas de la comunidad](https://gist.github.com/maximus2600/75d60bf3df62986e2254d5166e2524cb)
  - Te invitamos a compartir tu experiencia con otros modelos locales en nuestro [X](https://x.com/shedi_ai)

- **Ingeniería de Prompts**:
  - Los modelos locales requieren prompts más específicos y claros
  - Evita comandos ambiguos o de alto nivel
  - Divide las tareas complejas en pasos claros y detallados
  - Proporciona contexto y restricciones específicas

> **Nota**: La configuración económica puede producir resultados menos estables y requerir más iteraciones para tareas complejas.

> **Consejo**: ¡Siéntete libre de experimentar con tus propias configuraciones de modelos! ¿Encontraste una combinación excelente? Compártela con la comunidad en nuestro [X](https://x.com/shedi_ai) para ayudar a otros a optimizar sus configuraciones.

## 💡 Velo en Acción

Aquí tienes algunas tareas poderosas que puedes realizar con solo una frase:

1. **Resumen de Noticias**:
   > "Ve a TechCrunch y extrae los 10 principales titulares de las últimas 24 horas"

2. **Investigación en GitHub**:
   > "Busca los repositorios de Python en tendencia con más estrellas"

3. **Investigación de Compras**:
   > "Encuentra una bocina Bluetooth portátil en Amazon con diseño resistente al agua, a menos de $50. Debe tener una duración mínima de batería de 10 horas"

## 🛠️ Hoja de Ruta

Estamos desarrollando activamente Shedi AI con características emocionantes en el horizonte. ¡Te invitamos a unirte!

Consulta nuestra hoja de ruta detallada y las características próximas en nuestras [Discusiones de GitHub](https://github.com/shedi-ai/shedi/discussions/85). 

## 🤝 Contribuciones

**Necesitamos tu ayuda para hacer que Shedi AI sea aún mejor!**  Se aceptan contribuciones de todo tipo:

*  **Comparte Prompts y Casos de Uso** 
   * Únete a nuestro [servidor de Discord](https://discord.gg/NN3ABHggMK).
   * Comparte cómo estás usando Shedi AI. Ayúdanos a construir una biblioteca de prompts útiles y casos de uso reales.
*  **Proporciona Retroalimentación** 
   * Prueba Shedi AI y danos tu opinión sobre su rendimiento o sugiere mejoras en nuestro [servidor de Discord](https://discord.gg/NN3ABHggMK).
* **Contribuye con Código**
   * Consulta nuestro [CONTRIBUTING.md](CONTRIBUTING.md) para conocer las pautas sobre cómo contribuir con código al proyecto.
   * Envía pull requests para corrección de errores, funciones, o mejoras en la documentación.


Creemos en el poder del código abierto y la colaboración comunitaria. ¡Únete a nosotros para construir el futuro de la automatización web!


## 🔒 Seguridad

Si descubres una vulnerabilidad de seguridad, por favor **NO** la divulgues públicamente a través de issues, pull requests, o discusiones.

En su lugar, por favor crea un [GitHub Security Advisory](https://github.com/shedi-ai/shedi/security/advisories/new) para reportar la vulnerabilidad de forma responsable. Esto nos permite abordar el problema antes de que se divulgue públicamente.

¡Agradecemos tu ayuda para mantener Shedi AI y sus usuarios seguros!

## 💬 Comunidad

Únete a nuestra creciente comunidad de desarrolladores y usuarios:

- [X](https://x.com/shedi_ai) - Habla con el equipo y la comunidad
- [Twitter](https://x.com/shedi_ai) - Síguenos para actualizaciones y anuncios
- [GitHub Discussions](https://github.com/shedi-ai/shedi/discussions) - Comparte ideas y realiza preguntas

## 👏 Agradecimientos

Shedi AI se construye sobre otros increíbles proyectos de código abierto:

- [Browser Use](https://github.com/browser-use/browser-use)
- [Puppeteer](https://github.com/EmergenceAI/Agent-E)
- [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
- [LangChain](https://github.com/langchain-ai/langchainjs)

¡Un enorme agradecimiento a sus creadores y colaboradores!


## 📄 Licencia

Este proyecto está bajo la Licencia Apache 2.0 - consulta el archivo [LICENSE](LICENSE) para más detalles.

Hecho con ❤️ por el equipo de Shedi AI.

¿Te gusta Shedi AI? ¡Danos una estrella 🌟 y únete a nosotros en [X](https://x.com/shedi_ai) | [X](https://x.com/shedi_ai)

## 🔗 Nuestros otros productos

- [Directorio de plugins de DSH](https://dsh.directory/): Descubre plugins comunitarios instalables para DeepSeek Harness por categoría, popularidad y actividad.

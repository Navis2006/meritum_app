#### 🛠️ FASE 1: DESARROLLO DEL BACKEND (C# ASP.NET Core)

1. **Entidad y DTOs:**
   * La entidad de base de datos ![](vscode-file://vscode-app/c:/Users/angel/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/js.svg)

     Project debe tener propiedades tipo `string` para `ImageUrl` y `VideoUrl`, y una `List<string>` para `DocumentUrls`.
   * Crea un ![](vscode-file://vscode-app/c:/Users/angel/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/csharp.svg)

     CreateProjectDto que reciba `IFormFile? ImageFile`, `IFormFile? VideoFile` y `List<IFormFile>? DocumentFiles` a través de un `[FromForm]`.
   * **CRÍTICO:** Crea un ![](vscode-file://vscode-app/c:/Users/angel/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/csharp.svg)

     UpdateProjectDto exclusivo para la edición (`PUT`). Este DTO debe recibir los mismos `IFormFile`, pero además incluir banderas booleanas (`RemoveExistingImage`, `RemoveExistingVideo`) y un `string? KeptDocumentUrls` (separadas por comas). Esto es vital para que el cliente pueda instruir al servidor qué archivos preexistentes en la nube de MongoDB debe borrar o conservar al editar.
2. **Controlador (![](vscode-file://vscode-app/c:/Users/angel/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/csharp.svg)

   ProjectsController)** :

* **Endpoint de Creación (`POST`):** Recibe el ![](vscode-file://vscode-app/c:/Users/angel/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/csharp.svg)

  CreateProjectDto vía `FormData`. Guarda cada archivo en el servidor/nube, obtiene sus URLs y las inyecta en el objeto a guardar en BD.
* **Endpoint de Edición (`PUT`):** Recibe el ![](vscode-file://vscode-app/c:/Users/angel/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/csharp.svg)

  UpdateProjectDto vía `FormData`. La lógica debe verificar:

  * Si viene un nuevo `ImageFile`, sobrescribe la URL. Si `RemoveExistingImage` es  *true* , vacía la URL antigua.
  * Si viene un nuevo `VideoFile`, sobrescribe la URL. Si `RemoveExistingVideo` es  *true* , vacía la URL antigua.
  * Para los documentos: Reconstruye la lista `DocumentUrls` verificando cuáles URLs antiguas coinciden con la cadena enviada en `KeptDocumentUrls`. Finalmente, añade las URLs de los nuevos archivos `DocumentFiles` subidos en esa misma petición.

---

#### 🎨 FASE 2: DISEÑO DE INTERFAZ HTML Y CSS (Frontend)

Crea un Modal HTML (`#project-modal`) con los inputs de texto básicos y las siguientes áreas específicas para archivos, utilizando una paleta naranja/amarillo (`#FA742B`, `#FFE985`) y fondos claros modernos (`#FFFDF8` con `background-attachment: fixed`):

1. **Zonas de Arrastre (Imagen y Video):**
   * Dos cajas cuadradas con borde punteado (`border: 2px dashed #D1D5DB`) que actúen como `<label>` interactivo.
   * Un `<input type="file" style="position:absolute; inset:0; opacity:0; z-index:10;">` oculto encima.
   * Para la imagen: Un `<img>` de previsualización (oculto por defecto) con `z-index: 20`.
   * Para el video: Un `<video controls>` nativo de HTML5 (oculto por defecto) con aspecto redondeado y `z-index: 20` para que los controles sean cliqueables y no los bloquee el input file oculto.
2. **Zona de Documentos (El Diseño "Acumulativo"):**
   * Esta área se divide en dos:
     * Arriba: Un `<ul id="docs-preview-list">` vacío donde se renderizarán barras horizontales simulando los archivos seleccionados.
     * Abajo: Un botón "Añadir más" compuesto por una caja punteada. En el centro, un ícono de un documento genérico y pegado a su esquina inferior derecha, un pequeño círculo verde (`#10B981`) con un ícono de `+` blanco centrado perfectamente de `24x24px`. Un `<input type="file" multiple>` invisible debe recubrir esta caja inferior con `z-index: 10`.
3. **Botones Nativos de Eliminar ("X"):**
   * Cada visualización pre-cargada (imagen, video y listas de documentos) debe tener un botón `<button class="remove-file-btn">` posicionado de forma absoluta en su esquina.
   * **CRÍTICO:** No uses íconos de fuentes (como FontAwesome o Boxicons) para la X. Debes usar exactamente este código SVG incrustado de color gris oscuro mate integrado en un círculo gris clarito (`#F3F4F6` al reposo, `#E5E7EB` al hover): `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#484848" viewBox="2 2 20 20"><path d="M14.83 7.76 12 10.59 9.17 7.76 7.76 9.17 10.59 12l-2.83 2.83 1.41 1.41L12 13.41l2.83 2.83 1.41-1.41L13.41 12l2.83-2.83z"></path><path d="M12 2C9.33 2 6.82 3.04 4.93 4.93S2 9.33 2 12s1.04 5.18 2.93 7.07c1.95 1.95 4.51 2.92 7.07 2.92s5.12-.97 7.07-2.92S22 14.67 22 12s-1.04-5.18-2.93-7.07A9.93 9.93 0 0 0 12 2m5.66 15.66c-3.12 3.12-8.19 3.12-11.31 0-1.51-1.51-2.34-3.52-2.34-5.66s.83-4.15 2.34-5.66S9.87 4 12.01 4s4.15.83 5.66 2.34 2.34 3.52 2.34 5.66-.83 4.15-2.34 5.66Z"></path></svg>`

---

#### ⚙️ FASE 3: LÓGICA DE JAVASCRIPT VARILLA (![](vscode-file://vscode-app/c:/Users/angel/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/js.svg)

app.js)

Implementa la siguiente lógica de control del DOM y peticiones `fetch`:

1. **Prevención de Burbujeo de Eventos (Event Bubbling):**
   * Todos los botones tipo `.remove-file-btn` deben tener un Listener de click que ejecute OBLIGATORIAMENTE `e.preventDefault()` y `e.stopPropagation()`. Esto evitará que, al darle a la "X" para borrar un archivo, se abra accidentalmente la ventana del explorador de archivos del SO.
2. **Variables Globales de Estado de Edición:**
   * Crea variables let: `currentDocsTransfer = new DataTransfer()`, `keptDocumentUrls = []`, `removeExistingImage = false`, `removeExistingVideo = false`. Estas se resetearán cada vez que se oculte el modal (![](vscode-file://vscode-app/c:/Users/angel/AppData/Local/Programs/Antigravity/resources/app/extensions/theme-symbols/src/icons/files/js.svg)

     closeModal).
3. **Renderizado al "Editar Proyecto" (Mapeo de datos guardados en BD):**
   * Cuando se presiona "Editar", mapea las URLs que llegan de la API hacia la UI.
   * **Para el Video:** Usa la URL del backend y asígnala directamente a la propiedad `src` del elemento `<video>`.
   * **Nombres Humanos para Nube:** Al instanciar las URLs antiguas de `documentUrls`, aplica un `.split('/')` y pop para extraer el final de la cadena de texto de la BD de la nube, y poder inyectar un elemento de lista en el DOM (`<li>`) visualizando "☁️ [NombreDelArchivo.pdf]". Pinta ese bloque con un tono azul/morado leve para diferenciar que es de nube. Empuja estas URLs al array `keptDocumentUrls`.
4. **Uso de `DataTransfer` para Acumular Documentos (Múltiples Inputs Locales):**
   * **CRÍTICO:** Cuando ocurre el evento `change` en el input del explorador de documentos local, **NO SOBREESCRIBAS** la lista. Itera sobre `e.target.files` y añádelos iterativamente usando `.items.add(file)` a la variable global de tipo `DataTransfer` creada previamente. Luego reasigna `input.files = currentDocsTransfer.files`.
   * Ejecuta una función de "Pintado" que dibuje un `<li>` naranja claro ("📄 [NombreLocal.pdf]") por cada archivo acumulado.
5. **Lógica Unificada de Remoción:**
   * Si se da clic a la "X" de un elemento de Nube (☁️): filtra el array `keptDocumentUrls` quitando su URL y re-dibuja el contenedor de listas.
   * Si se da clic a la "X" de un archivo Local (📄): Crea un nuevo `DataTransfer` vacío, transfiere todos los elementos de `currentDocsTransfer` *excepto* el del índice presionado, reasigna la global y el `.files` del input puro, y re-dibuja la lista.
   * Si cierran un video presionando su "X", pon `.src = ""` y ejecuta `.pause()` sobre la clase nativa del video para que no se siga reproduciendo invisible de fondo. Setea `removeExistingVideo = true`.
6. **Envío del Paquete (`FormData`):**
   * Al hacer Submit del formulario, instancia `new FormData()`.
   * Haz un append de los Textos Planos.
   * Haz un append de los binarios directos (`input.files[0]`).
   * Haz un ciclo for para apendizar uno por uno los elementos múltiples (`DocumentFiles`).
   * Haz un append de los string y flags de control remoto: `RemoveExistingImage`, `RemoveExistingVideo` y `KeptDocumentUrls.join(',')`.
   * Usa Fetch para enviarlo al API usando el verbo `PUT` (si existe ID de edición) o `POST` (si es nuevo).

import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');

const projects={
  'a75':{
    eyebrow:'REFORMA RESIDENCIAL · MADRID',
    title:'Reforma integral A75',
    meta:['Reforma integral de apartamento','Barrio de Salamanca, Madrid, España','120 m²','Privado','© Wolfblanc Architects'],
    paragraphs:[
      'En el corazón de la Milla de Oro madrileña, en la confluencia de Conde de Peñalver y Ayala, A75 demuestra el poder de la luz y la fluidez espacial. La reforma transforma un apartamento compartimentado de 120 m² en un refugio urbano sereno y redefine la vivienda de alta gama en el barrio de Salamanca.',
      '<strong>La visión</strong><br>El proyecto va más allá de una reforma convencional para explorar una «autonomía conectada». Los propietarios buscaban una vivienda capaz de alternar entre encuentros sociales y retiro personal. La respuesta arquitectónica disuelve los límites rígidos de la distribución original y sustituye los pasillos oscuros por un volumen continuo que conecta el patio interior con la esquina urbana.',
      '<strong>Intervención arquitectónica</strong><br>La intervención invierte estratégicamente la planta. El núcleo social —salón y comedor— se traslada a la fachada de Conde de Peñalver para aprovechar la energía de la ciudad y la luz de poniente. Las estancias privadas se sitúan hacia Ayala, más tranquila, creando un filtro acústico natural.<br>Al eliminar particiones y sustituir cerramientos opacos por carpinterías de altas prestaciones, la antigua cocina oscura se convierte en una bisagra luminosa que lleva la luz hasta el centro de la vivienda.',
      '<strong>Materialidad y atmósfera</strong><br>La paleta material busca serenidad y permanencia. La pintura de adobe transpirable aporta una piel táctil y saludable que regula la humedad y suaviza la luz natural. La madera cálida y la carpintería a medida completan una vivienda expansiva e íntima, donde la funcionalidad contemporánea convive con el silencio artesanal.'
    ]
  },
  'axis':{
    eyebrow:'ARQUITECTURA · SEDE CORPORATIVA · BARCELONA',
    title:'Distrito AXIS',
    meta:['Sede corporativa y centro cultural','Distrito de innovación 22@, Barcelona, España','No divulgado','© Wolfblanc Architects'],
    paragraphs:[
      '<strong>La visión</strong><br>Distrito AXIS es un catalizador de usos mixtos situado en la expansión norte del 22@ de Barcelona. Reinterpreta el parque empresarial mediterráneo no como una torre de vidrio, sino como un campus táctil y arraigado que media entre el pasado industrial y el futuro digital.',
      '<strong>Estrategia de diseño</strong><br>La arquitectura se define por un «brutalismo mediterráneo». El hormigón blanco refleja la intensa luz costera y contrasta con el acero negro, referencia al legado metalúrgico del área. Dos volúmenes monolíticos quedan atravesados por el «Eje», un puente suspendido que conecta física y simbólicamente los espacios de trabajo con el auditorio cultural.',
      '<strong>Dinámica espacial</strong><br>Frente al bloque de oficinas convencional, el proyecto prioriza la permeabilidad. Grandes paños de vidrio rompen la masa de hormigón e introducen luz en plantas profundas. En el nivel de acceso, gradas de hormigón y un paisaje mineral mínimo forman una plaza hundida que difumina el límite entre edificio privado y espacio público.',
      '<strong>Masa y lugar · Conexión y vacío · Fachada y estructura · Paisaje y vida</strong>'
    ]
  },
  'bistro-dterra-cafe-restaurant-interior-design':{
    eyebrow:'INTERIORISMO DE HOSTELERÍA · MADRID',
    title:'Bistró Dterra',
    meta:['Café-bar y restaurante · interiorismo y concepto espacial','Chamberí, Madrid, España','Dterra','© Wolfblanc Architects'],
    paragraphs:[
      'En el tejido urbano de Chamberí, Bistró Dterra es un refugio de silencio táctil frente al ritmo de la ciudad. El proyecto explora la dualidad entre la calidez mediterránea y la contención funcional del diseño nórdico.',
      'La estrategia espacial se apoya en una «zonificación sensorial». Paneles acústicos de roble y superficies texturizadas filtran la luz intensa sin perder luminosidad. Un suelo continuo de microcemento cálido enlaza el ritmo de la barra con las zonas de comedor y crea una base unitaria para el mobiliario.',
      'La paleta material establece un diálogo honesto entre geografía y oficio: revocos de arcilla sin cocer anclan el espacio a su contexto español, mientras la carpintería limpia, lineal y sin ornamento remite a la tradición sueca.',
      'La distribución es fluida pero diferenciada. Una barra dinámica de travertino acoge el café de la mañana, mientras bancos corridos tapizados con tejidos naturales ofrecen una experiencia pausada y protegida. Dterra no busca llamar la atención: demuestra cómo la integridad material y la escala humana pueden dar permanencia a un espacio contenido.'
    ]
  },
  'boutique-apartment-v1':{
    eyebrow:'INTERIORISMO · ESTOCOLMO',
    title:'Apartamento boutique V1',
    meta:['Reforma integral y estilismo interior','Vasastan, Estocolmo, Suecia','125 m²','Privado','© Wolfblanc Architects'],
    paragraphs:[
      'Wolfblanc desarrolló un concepto interior integral para V1, un apartamento contemporáneo en Vasastan pensado para ofrecer una experiencia sensorial de alta gama en estancias cortas y maximizar el rendimiento de la inversión. El proyecto combina proporciones clásicas, líneas escandinavas, materiales naturales duraderos y una paleta monocromática sutil.',
      'El objetivo fue transformar un interior convencional de Estocolmo en un refugio boutique atractivo y listo para operar. El minimalismo suave, las texturas táctiles y los tonos greige, arena, topo cálido y roble claro crean un ambiente reconocible dentro del mercado premium.',
      'El diseño espacial, la carpintería integrada y una cuidada puesta en escena nórdica mejoran el recorrido, el confort y la durabilidad de cada estancia.',
      'V1 muestra cómo el interiorismo estratégico puede convertir un alojamiento temporal en una experiencia emocional duradera, elevando ocupación y retorno sin perder serenidad ni atemporalidad.',
      '«Diseñar V1 consistió en explorar la calma mediante tonos suaves, optimizar el espacio y crear un activo boutique de alto rendimiento.»'
    ]
  },
  'calderon-stadium-urban-living':{
    eyebrow:'REUTILIZACIÓN ADAPTATIVA · MADRID',
    title:'Vivienda urbana en el estadio Calderón',
    meta:['Reutilización adaptativa · vivienda, hostelería, biblioteca y comercio','Madrid, España','No divulgado','© Wolfblanc Architects'],
    paragraphs:[
      'El estadio Vicente Calderón, antigua sede del Atlético de Madrid desde 1966, se sitúa frente al Manzanares e integrado en Madrid Río. El parque recuperó las riberas y reconectó la ciudad con el paisaje, soterrando el tráfico. La parcela del estadio quedó fuera de esa continuidad y ofrece la oportunidad de redefinir su papel urbano.',
      '<strong>Integración urbana continua:</strong> se elimina el volumen suroeste para prolongar Madrid Río a través de la parcela y crear un corredor verde continuo. El tráfico se desvía bajo rasante para priorizar al peatón.',
      '<strong>Nodo de vida urbana:</strong> el diseño conecta orgánicamente el parque con los barrios residenciales mediante vivienda, hostel, biblioteca, comercio y espacios comunitarios que favorecen una vida urbana activa.',
      '<strong>Reutilización y sostenibilidad:</strong> la estructura de hormigón existente se conserva y adapta con una estructura metálica ligera. Ventilación cruzada, iluminación natural, vidrios inclinados y cubiertas verdes mejoran la eficiencia energética.',
      'El proyecto convierte el Calderón en un nodo urbano sostenible conectado con Madrid Río. Naturaleza, comunidad y reutilización adaptativa se combinan como modelo de regeneración contemporánea.'
    ]
  },
  'casa-boadilla-madrid-luxury-family-residence':{
    eyebrow:'ARQUITECTURA RESIDENCIAL · MADRID',
    title:'Casa Boadilla',
    meta:['Residencia privada · vivienda familiar permanente','Boadilla del Monte, Madrid, España','Privado','© Wolfblanc Architects'],
    paragraphs:[
      'Situada en Boadilla del Monte, uno de los enclaves verdes más exclusivos de Madrid, esta vivienda reinterpreta la casa familiar como una integración entre rigor moderno y serenidad natural. No es un retiro vacacional, sino una residencia preparada para la vida cotidiana y conectada profundamente con el paisaje.',
      'La volumetría se compone de dos piezas intersectadas que responden a la topografía y a la vegetación. El volumen superior de hormigón visto vuela sobre la planta baja, genera sombra frente al sol madrileño y forma porches protegidos. El revestimiento vertical de madera establece un ritmo táctil que dialoga con los pinos existentes.',
      'En el interior, la organización prioriza la conexión familiar y la calidez material. El techo de madera se prolonga desde las zonas abiertas hasta los vuelos exteriores y disuelve el límite entre casa y bosque. Una cocina monumental de islas pétreas funciona como corazón cotidiano; arriba, dormitorios y suite principal forman un ámbito privado abierto al paisaje.',
      'El paisajismo prolonga el espacio habitable mediante una piscina lineal y una gran plataforma de madera elevada sobre el terreno. Casa Boadilla demuestra que una residencia permanente puede ofrecer una atmósfera de refugio, tranquila y sofisticada, a pocos minutos de la capital.'
    ]
  },
  'edificio-salamanca':{
    eyebrow:'RESIDENCIAL Y COMERCIAL · MADRID',
    title:'Edificio Salamanca',
    meta:['Uso mixto: residencial y comercial','Barrio de Salamanca, Madrid, España','Grupo inversor privado','© Wolfblanc Architects'],
    paragraphs:[
      'En el barrio de Salamanca, este edificio de uso mixto redefine la vivienda urbana de lujo integrando calidad residencial, actividad a pie de calle y precisión arquitectónica. Apartamentos con servicios ocupan cinco plantas sobre un café-restaurante que activa el nivel urbano.',
      'La arquitectura equilibra presencia y discreción. Piedra cálida y balcones profundos con vegetación responden a la escala tradicional mediante una materialidad contemporánea. Ventanales de suelo a techo, terrazas privadas y almacenamiento integrado sirven tanto a la residencia permanente como a estancias prolongadas.',
      'En planta baja, Wolfblanc desarrolla el concepto interior del café-restaurante: un espacio luminoso de materiales naturales, carpintería a medida y continuidad interior-exterior. No funciona como un local aislado, sino como extensión de la identidad del edificio y de la vida social del barrio.',
      'La cubierta incorpora una terraza privada con pérgolas, cocina exterior y vistas sobre la ciudad. Este espacio compartido transforma una suma de unidades en una comunidad vertical cuidadosamente diseñada.',
      'El proyecto demuestra cómo el desarrollo urbano contemporáneo puede respetar el contexto, mejorar la vida cotidiana y crear valor mediante inteligencia de diseño.'
    ]
  },
  'el-pilar':{
    eyebrow:'REGENERACIÓN URBANA · MADRID',
    title:'El Pilar',
    meta:['Regeneración urbana','El Pilar, Madrid, España','No divulgado','© Wolfblanc Architects'],
    paragraphs:[
      'La propuesta revitaliza una manzana infrautilizada de El Pilar mediante un anillo central que redistribuye el comercio, amplía las zonas verdes e incorpora equipamientos culturales. Nuevas viviendas norte-sur con paneles solares mejoran iluminación, ventilación y eficiencia. El anillo elevado, apoyado en cerchas metálicas, enlaza plazas y una zona arbolada para crear un entorno comunitario accesible, activo y sostenible.'
    ]
  },
  'granolita-coffee-boutique-cafe-interior-project':{
    eyebrow:'HOSTELERÍA · INTERIOR DE CAFÉ · PALMA',
    title:'Granolita',
    meta:['Hostelería · café boutique','Santa Catalina, Palma de Mallorca, España','Granolita Group','© Wolfblanc Architects'],
    paragraphs:[
      'En el histórico barrio de Santa Catalina, Granolita es un ejercicio de minimalismo táctil concebido como refugio frente a la actividad de la calle mediterránea. El proyecto une precisión nórdica y calidez mediterránea en un espacio sereno y ligero.',
      'La intervención se construye sobre el diálogo entre peso y luz. Una barra monolítica de travertino rugoso ancla el espacio e invita al tacto. Paredes de cal en tonos arena suavizan la acústica y transforman la intensa luz de la isla en un resplandor dorado.',
      'El programa prolonga el interior hacia la calle mediante grandes puertas pivotantes de acero que abren el espacio a un patio de piedra caliza. Terciopelo en tonos óxido y carpintería de nogal oscuro aportan profundidad a una envolvente neutra y definen rincones integrados en la fábrica existente.',
      'La paleta es contenida y rica en textura. Azulejos borgoña hechos a mano dialogan con la cerámica española, mientras la carpintería simétrica expresa funcionalismo sueco. Granolita propone una atmósfera donde silencio, sombra y materia permanecen en equilibrio.'
    ]
  },
  'horizon':{
    eyebrow:'ARQUITECTURA RESIDENCIAL · GALICIA',
    title:'Horizon House',
    meta:['Residencia privada','Sanxenxo, Galicia, España','No divulgado','© Wolfblanc Architects'],
    paragraphs:[
      'En la costa española, Horizon House busca fundirse con el paisaje mediante una arquitectura contenida, luminosa y precisa. Una estructura de acero en carbón mate y muros de revoco beige enmarcan el horizonte y dan continuidad a los espacios interiores y exteriores.',
      'El programa se desarrolla en una sola planta. Salón, cocina y dormitorio se orientan al mar y se prolongan hacia una amplia terraza perimetral. Luz natural, ritmo estructural y transparencia construyen una atmósfera serena, abierta al paisaje y al mismo tiempo protegida.',
      'Fiel a la filosofía de Wolfblanc, el proyecto combina una estética esencial con atención rigurosa al detalle constructivo y al diálogo entre material y contexto. Horizon House reflexiona sobre simplicidad, proporción y vínculo íntimo entre arquitectura y naturaleza.'
    ]
  },
  'k12':{
    eyebrow:'REFORMA RESIDENCIAL · ESTOCOLMO',
    title:'Vivienda compacta K12',
    meta:['Reforma integral de apartamento','Estocolmo, Suecia','36 m²','Privado','© Wolfblanc Architects'],
    paragraphs:[
      'En el centro de Estocolmo, Wolfblanc transforma un apartamento compacto de 36 m² en una vivienda funcional y equilibrada, pensada tanto para uso personal como para conservar potencial de inversión.',
      'Situado en un edificio funcionalista de los años treinta, el espacio requería una reorganización completa. La nueva planta incorpora dormitorio definido, cocina contemporánea, baño optimizado, almacenamiento integrado y carpintería a medida para aprovechar cada metro cuadrado.',
      'El resultado es un interior refinado y adaptable que funciona como residencia permanente o alquiler de corta estancia. La inteligencia espacial y un diseño atemporal demuestran cómo una reforma de pequeña escala puede aportar calidad de vida y retorno de inversión.'
    ]
  },
  'k38':{
    eyebrow:'REFORMA RESIDENCIAL · ATENAS',
    title:'Rehabilitación residencial K38',
    meta:['Reforma de dos apartamentos','Atenas, Grecia','70 + 30 m²','Privado','© Wolfblanc Architects'],
    paragraphs:[
      'En el tejido denso del centro de Atenas, K38 plantea un diálogo entre la energía caótica de la ciudad y la calma de un refugio. Una planta pentagonal fragmentada se reestructura completamente para crear dos unidades residenciales independientes y adaptables.',
      '<strong>Filosofía de diseño</strong><br>La precisión funcional escandinava se combina con la calidez táctil mediterránea. El interior se devuelve a su estructura esencial y la antigua compartimentación da paso a recorridos fluidos que asumen la geometría singular del edificio.',
      '<strong>Materialidad y luz</strong><br>Travertino apomazado, roble blanco mate y revocos beige texturizados amplifican la luz y equilibran la intensidad del sol ateniense. La paleta suaviza la acústica y genera espacios envolventes sin resultar estériles.',
      '<strong>La experiencia</strong><br>K38 se concibe como retiro frente al ruido urbano. La terraza prolonga el interior con olivos y lavanda; el pavimento cruza el cerramiento y las sombras filtradas por la vegetación refrescan naturalmente una vivienda que respira con el ritmo del día.'
    ]
  },
  'lavapies-intervention':{
    eyebrow:'REGENERACIÓN URBANA · MADRID',
    title:'Intervención en Lavapiés',
    meta:['Regeneración urbana · vivienda y espacio público','Lavapiés, Madrid, España','No divulgado','© Wolfblanc Architects'],
    paragraphs:[
      'Este proyecto reimagina una manzana de Lavapiés mediante estrategias de microurbanismo. Un jardín público con auditorio al aire libre y espacios interiores flexibles forma un nodo cultural y ecológico. Nuevas viviendas se suspenden de los muros perimetrales existentes, preservan el paisaje histórico de la calle y activan el interior con luz natural y fachadas de vidrio configurables. La propuesta refuerza comunidad, sostenibilidad e identidad en un barrio denso y diverso.'
    ]
  },
  'market-regeneration':{
    eyebrow:'ARQUITECTURA · URBANISMO · ALMERÍA',
    title:'Regeneración del mercado',
    meta:['Arquitectura, urbanismo y paisaje · mercado y espacio público','Almería, Andalucía, España','Público','© Wolfblanc Architects'],
    paragraphs:[
      'Regeneración del mercado reinterpreta el mercado urbano como una sala cívica sombreada: un lugar para comerciar, encontrarse, moverse y compartir la vida cotidiana. No se entiende como objeto comercial aislado, sino como infraestructura urbana adaptada al clima e integrada en el espacio público.',
      'El gesto principal es un sistema ligero de marquesinas que organiza la circulación, genera sombra y crea una presencia urbana reconocible sin cerrar el espacio. Arquitectura y dispositivo ambiental trabajan juntos para reducir calor y deslumbramiento y conectar el mercado con sus calles.',
      'Bajo la cubierta, vegetación, bancos, pavimentos e iluminación construyen una secuencia de microclimas confortables. El suelo se convierte en una superficie pública continua entre accesos, recorridos y áreas de pausa, permitiendo que el comercio se extienda hacia la plaza.',
      'El diseño admite distintas velocidades y usos: compra rápida, encuentros informales, actividad nocturna y estancias largas. La circulación se clarifica y los bordes se activan. Sombra, vegetación y luz son las herramientas espaciales que hacen funcionar la propuesta.',
      'Arquitectura, paisaje y estrategia de espacio público se combinan para crear un entorno cotidiano más duradero, confortable y memorable.',
      'Es una propuesta para la vida comercial ante un clima cambiante: abierta, sombreada, cívica y resiliente.'
    ]
  },
  'museum':{
    eyebrow:'MUSEO · RESTAURACIÓN · ATENAS',
    title:'Nexus',
    meta:['Nuevo museo, restauración de edificios neoclásicos y excavación arqueológica','Atenas, Grecia','No divulgado','© Wolfblanc Architects'],
    paragraphs:[
      'El proyecto propone una intervención urbana en el centro de Atenas que integra conservación histórica, arquitectura contemporánea y sostenibilidad. Tres torres expositivas organizan el recinto, mientras pasarelas metálicas elevadas recorren los hallazgos arqueológicos y permiten contemplarlos sin alterar su integridad.',
      'Los restos antiguos se exponen e incorporan al tejido urbano. Las intervenciones mínimas restauran los edificios neoclásicos para administración, biblioteca, mantenimiento y almacenamiento. Una cubierta unitaria de hormigón respeta la altura de la ciudad, vincula el conjunto y protege las áreas expositivas.',
      'Hormigón, metal y ladrillo establecen un diálogo entre elementos contemporáneos y contexto histórico. Nexus equilibra las capas de la historia ateniense con una visión para su futuro urbano y cultural.'
    ]
  },
  'norrsken-office-workplace-design':{
    eyebrow:'INTERIOR DE OFICINAS · ESTOCOLMO',
    title:'Oficinas Norrsken',
    meta:['Interiorismo, marca y concepto de espacio de trabajo','Estocolmo, Suecia','Norrsken','© Wolfblanc Architects'],
    paragraphs:[
      'Norrsken ocupa una estructura industrial reutilizada. La intervención equilibra la intensidad del armazón brutalista existente con la calidez necesaria para el trabajo y la productividad a largo plazo.',
      'El reto fue conciliar concentración profunda y colaboración abierta. La planta se organiza alrededor de un «núcleo ámbar» de vidrio translúcido y zonificación acústica inspirado en el resplandor de la aurora boreal. El color funciona también como orientación entre áreas sociales y zonas silenciosas de hormigón y fieltro gris.',
      '<strong>Geografía acústica:</strong> cortinas pesadas y bafles absorbentes gradúan el paso desde el ágora abierta hasta las cabinas de concentración.',
      '<strong>Honestidad material:</strong> las instalaciones permanecen vistas y se pintan en el ámbar de la marca, integrando los sistemas mecánicos en la arquitectura interior.',
      '<strong>El ancla fika:</strong> una cocina social central forma el corazón comunitario. Roble natural y elementos biofílicos aportan calidez y respaldan la cultura escandinava del encuentro.',
      'La identidad visual se integra en el espacio construido para crear un entorno de trabajo claro, acogedor y optimista. El proyecto demuestra cómo la reutilización adaptativa puede ofrecer una sede acústicamente eficaz y visualmente memorable.'
    ]
  },
  'plato':{
    eyebrow:'PLAN MAESTRO · RESIDENCIAL · ATENAS',
    title:'Distrito Academia',
    meta:['Plan maestro y distrito residencial','Atenas, Grecia','30.000 m²','No divulgado','© Wolfblanc Architects'],
    paragraphs:[
      'En el encuentro entre el patrimonio industrial y la historia antigua de Atenas, la propuesta plantea una regeneración urbana estratégica a gran escala. El plan maestro convierte una parcela fragmentada en un distrito residencial cohesionado y denso que enlaza el Parque de la Academia con el tejido urbano.',
      'El lenguaje supera la manzana tradicional y fragmenta el volumen para crear un ecosistema poroso. Hormigón blanco visto refleja la luz ática y contrasta con madera clara sin tratar que adquirirá una pátina plateada con el tiempo.',
      'Los ámbitos públicos y privados se mezclan mediante vegetación xerófila, silvestre y resistente a la sequía. La estrategia reduce mantenimiento, mejora biodiversidad y crea un refugio silencioso dentro de una ciudad intensa, configurando un activo duradero para residentes e inversores.'
    ]
  },
  'selva-boutique-luxury-design':{
    eyebrow:'HOSTELERÍA · ARQUITECTURA · GRAZALEMA',
    title:'Hotel Selva',
    meta:['Arquitectura, interiorismo y paisajismo','Sierra de Grazalema, Andalucía, España','850 m²','Grupo hostelero privado','© Wolfblanc Architects'],
    paragraphs:[
      'Frente a las cumbres calizas de la sierra andaluza, SELVA reinterpreta el cortijo tradicional como un refugio boutique introspectivo. El exterior respeta muros encalados, teja cerámica y huecos profundos; el interior revela un jardín secreto de tonos intensos y lujo táctil protegido del sol.',
      '<strong>El concepto: ósmosis con la naturaleza</strong><br>«Naturaleza refinada» entiende el hotel como una membrana entre paisaje y experiencia. Los interiores ofrecen sombra y frescor, destilando el entorno en una paleta material sofisticada:',
      '<strong>El verde:</strong> terciopelo verde musgo en cortinas y tapicerías traduce la sombra de olivares y encinares en suavidad arquitectónica.',
      '<strong>El sol:</strong> luminarias de latón cepillado y acentos dorados reinterpretan la luz filtrada entre las hojas.',
      '<strong>La tierra:</strong> mármol Emperador oscuro y terrazo remiten a los lechos pétreos del valle y anclan el espacio.',
      '<strong>Integración de arquitectura y paisaje</strong><br>El proyecto rehabilita tres estructuras agrarias y diseña el patio central. Un atrio de doble altura enmarca olivos antiguos y el restaurante se prolonga hacia un salón botánico donde helechos y hiedras recuperan la mampostería.',
      'La sostenibilidad se integra en la arquitectura. Los muros existentes aportan inercia térmica y la ventilación pasiva aprovecha el microclima del patio. El agua participa en un sistema de filtración de aguas grises que alimenta los jardines.',
      'SELVA no es solo un hotel, sino un cambio de atmósfera: un lugar donde el ritmo se ajusta al paisaje y la naturaleza permanece suficientemente presente para transformar la experiencia.'
    ]
  },
  'senior-coliving':{
    eyebrow:'ARQUITECTURA · SENIOR LIVING · A CORUÑA',
    title:'Senior Coliving',
    meta:['Arquitectura, interiorismo y paisaje · residencia senior y coliving','A Coruña, Galicia, España','3.400 m²','Público','© Wolfblanc Architects'],
    paragraphs:[
      'Senior Coliving propone un nuevo modelo residencial para edades avanzadas basado en independencia, comunidad y dignidad cotidiana. Se aleja del lenguaje institucional y desarrolla una aldea cubierta: viviendas de escala doméstica conectadas por una amplia galería acristalada.',
      'La calle interior es el corazón social y climático. Más que un pasillo, ofrece un recorrido protegido para caminar, encontrarse y orientarse, y un paisaje compartido durante todo el año en un clima de lluvia y luz suave.',
      'Las unidades se conciben como casas reconocibles, no como habitaciones en un corredor anónimo. Cada una dispone de umbral propio, identidad clara y relación directa con patios plantados, reduciendo la escala institucional y facilitando rutinas familiares.',
      'Madera cálida, particiones transparentes, luz natural suave y vistas al jardín acercan la atmósfera a una vivienda. La arquitectura es deliberadamente tranquila: apoya el cuidado, la orientación y el contacto social sin resultar clínica.',
      'Patios, bordes plantados y estancias exteriores protegidas incorporan el cambio estacional a la vida cotidiana y ofrecen privacidad, actividad y retiro. Arquitectura, interiores y paisaje trabajan juntos en favor del bienestar.',
      'Senior Coliving plantea un modelo más humano para vivir la madurez: claro, social, consciente del clima y arraigado en los rituales diarios.'
    ]
  },
  'urban-landscape-athens':{
    eyebrow:'REDISEÑO DEL PAISAJE · ATENAS',
    title:'Plaza Varvakeios',
    meta:['Rediseño paisajístico · plaza cívica','Centro histórico de Atenas, Grecia','No divulgado','© Wolfblanc Architects'],
    paragraphs:[
      'En el centro histórico de Atenas, la plaza Varvakeios se reimagina como un espacio urbano activo, seguro e inclusivo. Inspirado en los soportales y cubiertas del entorno, el diseño superpone capas físicas y sociales para recuperar la vida pública. La conservación de elementos clave y una topografía abierta y multinivel favorecen conexión, exploración y encuentro. Vegetación e infraestructura adaptable crean un nodo resiliente donde conviven cultura, ecología y vida urbana.'
    ]
  }
};

const labels={Use:'Uso',Location:'Ubicación',Area:'Superficie',Client:'Cliente',Photos:'Imágenes'};

function escapeAttribute(value){
  return value
    .replace(/&/g,'&amp;')
    .replace(/"/g,'&quot;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

function bilingualTag(tag,attributes,en,es){
  return `<${tag}${attributes} data-en="${escapeAttribute(en)}" data-es="${escapeAttribute(es)}">${en}</${tag}>`;
}

function translateCountries(value){
  return value.replace(/\bSpain\b/g,'España').replace(/\bSweden\b/g,'Suecia').replace(/\bGreece\b/g,'Grecia');
}

let updated=0;
for(const [slug,translation] of Object.entries(projects)){
  const file=path.join(root,'portfolio',slug,'index.html');
  let html=fs.readFileSync(file,'utf8');

  html=html.replace(/<a href="\.\.\/\.\.\/portfolio\/" class="back-link"[^>]*>([\s\S]*?)<\/a>/,
    '<a href="../../portfolio/" class="back-link" data-en="&larr; Portfolio" data-es="&larr; Proyectos">&larr; Portfolio</a>');

  html=html.replace(/<span class="eyebrow"[^>]*>([\s\S]*?)<\/span>/,
    (_,en)=>bilingualTag('span',' class="eyebrow"',en.trim(),translation.eyebrow));
  html=html.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/,
    (_,en)=>bilingualTag('h1','',en.trim(),translation.title));
  html=html.replace(/<p class="lead"[^>]*>([\s\S]*?)<\/p>/,
    (_,en)=>bilingualTag('p',' class="lead"',en.trim(),translation.paragraphs[0]));

  html=html.replace(/<p class="img-caption"[^>]*>([\s\S]*?)<\/p>/,
    (_,en)=>bilingualTag('p',' class="img-caption"',en.trim(),translateCountries(en.trim())));

  const articleMatch=html.match(/<article class="wb-body">([\s\S]*?)<\/article>/);
  if(!articleMatch)throw new Error(`Article missing: ${slug}`);
  let article=articleMatch[1];
  let metaIndex=0;
  article=article.replace(/<tr><td[^>]*>([\s\S]*?)<\/td><td[^>]*>([\s\S]*?)<\/td><\/tr>/g,(_,label,value)=>{
    const esValue=translation.meta[metaIndex++];
    if(esValue===undefined)throw new Error(`Missing metadata translation ${slug} row ${metaIndex}`);
    return `<tr>${bilingualTag('td','',label.trim(),labels[label.trim()]||label.trim())}${bilingualTag('td','',value.trim(),esValue)}</tr>`;
  });
  if(metaIndex!==translation.meta.length)throw new Error(`Metadata count mismatch: ${slug}`);

  let paragraphIndex=0;
  article=article.replace(/<p( class="opening")?[^>]*>([\s\S]*?)<\/p>/g,(_,opening,en)=>{
    const es=translation.paragraphs[paragraphIndex++];
    if(es===undefined)throw new Error(`Missing paragraph translation ${slug} paragraph ${paragraphIndex}`);
    return bilingualTag('p',opening||'',en.trim(),es);
  });
  if(paragraphIndex!==translation.paragraphs.length)throw new Error(`Paragraph count mismatch: ${slug} (${paragraphIndex}/${translation.paragraphs.length})`);
  html=html.replace(articleMatch[0],`<article class="wb-body">${article}</article>`);

  html=html.replace(/<section class="project-gallery" aria-label="[^"]+">/,
    `<section class="project-gallery" aria-label="${escapeAttribute(translation.title)} — galería del proyecto">`);
  html=html.replace(/<figcaption>([^<]+)<\/figcaption>/g,(_,caption)=>
    bilingualTag('figcaption','',caption.trim(),caption.trim().replace(/^[^·]+/,translation.title))
  );

  fs.writeFileSync(file,html);
  updated++;
}

console.log(`Added complete EN/ES project content to ${updated} case studies.`);

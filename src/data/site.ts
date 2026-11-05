export const SITE = {
  name: "Art Me Graphics",
  short: "ART ME",
  tagline: "Мото графики",
  phone: "0886 216 097",
  phoneHref: "tel:+359886216097",
  email: "artmeoffice@gmail.com",
  address: "ул. „Св. Кирил и Методий“ 22, гр. Левски, обл. Плевен",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/artmestudiodesign/" },
    { label: "TikTok", href: "https://www.tiktok.com/@art.me.studio2024" },
    { label: "YouTube", href: "https://www.youtube.com/@artmegraphics" },
    { label: "Facebook", href: "https://www.facebook.com/share/1FzaujQRH7/" }
  ],
  installFrom: 60,
  installTrackUpTo: 200,
  extraCorrection: 25,
  freeCorrections: 3,
  leadDays: 7,
  advancePct: 50
} as const;

export type CategoryKey = "motokros" | "pistovi" | "atv" | "dzhetove" | "skuteri";

export const CATEGORIES: { key: CategoryKey; title: string; blurb: string; brands: string[]; scheme: string; install: string | null }[] = [
  { key: "motokros", title: "Мотокрос", blurb: "KTM, Husqvarna, Yamaha, Honda, GASGAS и още", brands: ["KTM", "Husqvarna", "Yamaha", "Honda", "GASGAS", "Kawasaki", "Beta", "Stark Varg", "Suzuki"], scheme: "neon", install: "от 60 €" },
  { key: "pistovi", title: "Пистови мотори", blurb: "Ducati, BMW, Yamaha, Kawasaki, Suzuki, Honda", brands: ["Ducati", "BMW", "Yamaha", "Kawasaki", "Suzuki", "Honda"], scheme: "blue", install: "до 200 €" },
  { key: "atv", title: "ATV", blurb: "Пълни комплекти за калници и обтекатели", brands: [], scheme: "purple", install: null },
  { key: "dzhetove", title: "Джетове", blurb: "Sea-Doo, Yamaha, Kawasaki", brands: ["Sea-Doo", "Yamaha", "Kawasaki"], scheme: "teal", install: null },
  { key: "skuteri", title: "Скутери", blurb: "Suzuki, Kawasaki, Yamaha, Honda", brands: ["Suzuki", "Kawasaki", "Yamaha", "Honda"], scheme: "pink", install: null }
];

export const RIDERS = [
  { name: "Мартин Чой", note: "Ducati · шаблон, дизайн и печат", scheme: "pink" },
  { name: "Димитър Тотев „Гумата“", note: "KTM · персонален дизайн", scheme: "neon" },
  { name: "Ния Гетова", note: "M6 Team Yamaha · спонсорска визия", scheme: "blue" },
  { name: "Присадов", note: "M6 Team Yamaha", scheme: "blue" },
  { name: "MotoLab Riding School", note: "Александър Ленев · GASGAS и KTM", scheme: "purple" },
  { name: "Никол Илиева и Препараторите", note: "KTM", scheme: "neon" },
  { name: "Н. Зарева", note: "GASGAS", scheme: "pink" },
  { name: "BMA Racing School", note: "IMR", scheme: "teal" }
];

export const FAQ = [
  ["Мога ли да видя проекта преди печат?", "Да. Всеки проект се изработва с 3D визуализация за одобрение. Печатаме едва след като потвърдиш финалния вариант."],
  ["Колко време отнема поръчката?", "До 7 работни дни след авансовото плащане и одобрената 3D визуализация. По-сложни проекти може да отнемат повече, за което ще те предупредим предварително."],
  ["Мога ли да добавя номер и име?", "Да, персонализацията е включена в цената. Добавяме номер, име, отбор и спонсорски логота."],
  ["Предлагате ли монтаж?", "Да. Кросов мотор от 60 €, пистов мотор до 200 €. Точната цена зависи от модела и броя части."],
  ["Защо има капаро от 50%?", "Дизайнът и визуализацията се правят специално за теб. Капарото покрива тази работа, ако поръчката бъде отказана след старта. При отказ след започване на работа то не се възстановява."],
  ["Какво става, ако визуализацията не пасва на моите пластмаси?", "Коригираме безплатно всяко несъответствие с реалните размери. Освен това имаш до 3 безплатни корекции на дизайна. Всяка следваща е 25 €."],
  ["Как се доставя?", "С Еконт до офис или адрес. Цената на доставката е по тарифата на куриера и се плаща от получателя, освен ако не е договорено друго."],
  ["Правите ли графики и за други превозни средства?", "Да. ATV, джетове, скутери, бусове, автомобили и рекламни стикери. Всички дизайни адаптираме към конкретния модел."],
  ["Колко издръжливи са графиките?", "Създадени са за мотокрос, ендуро и офроуд. ARLON фолио с агресивно лепило и ламинат ProTec 3960 пазят от кал, надраскване и UV лъчи."]
] as const;

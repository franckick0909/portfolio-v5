import Image from "next/image";
import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import WorksFooter from "@/components/sections/WorksFooter";
import Header from "@/components/navigation/Header";
import { I18nProvider } from "@/lib/i18n";

// Base de données locale pour les projets
const projectsData: Record<string, any> = {
  "angel-tattoo": {
    name: "Angel-Tattoo",
    category: "Design & Development",
    year: "2024",
    image: "/projets/tatto2.png",
    description: "Une plateforme immersive et sombre conçue pour un salon de tatouage, mettant en valeur l'art et le détail à travers un design minimaliste et brut.",
    client: "Angel Tattoo Studio",
    url: "https://angel-tattoo.vercel.app/"
  },
  "harmonie": {
    name: "Harmonie",
    category: "Healthcare Website",
    year: "2026",
    themeColor: "#F3E6CD",
    image: "/projets/harmonie/harmonie5.jpg",
     images: {
      hero: "/projets/harmonie/harmonie1.jpg",             // 1. Image géante tout en haut
      presentation: "/projets/harmonie/mockup.png",
      features: [                                         // 2. Les 3 petites images de la grille produits
        "/projets/harmonie/harmonie7.jpg", 
        "/projets/harmonie/harmonie8.jpg", 
        "/projets/harmonie/harmonie9.jpg"
      ],
      parallax: "/projets/harmonie/harmonie2.jpg",     // 3. L'image floutée en fond derrière le gros texte
      showcase: [                                         // 4. Les images dans la grille des 4 cartes
        "/projets/harmonie/harmonie4.jpg",               // - L'image de la carte de gauche
        "/projets/harmonie/harmonie10.jpg"       // - L'image détourée de la carte avec la bouteille
      ],
      bottom: "/projets/harmonie/harmonie12.jpg"          // 5. L'immense image finale avant le Footer
    },
    description: "Un espace digital rassurant et épuré pour un cabinet infirmier, pensé pour l'accessibilité et la clarté de l'information médicale.",
    client: "Cabinet Harmonie",
    url: "https://harmonie-woad.vercel.app/"
  },
  "immo1_shop": {
    name: "IMMO1.shop",
    category: "E-commerce Skin Care",
    year: "2025",
    image: "/projets/imo1.jpg",
    description: "Une boutique en ligne haut de gamme dédiée aux soins de la peau. Le design met l'accent sur la pureté, la fluidité et une expérience d'achat sans friction.",
    client: "IMMO1 Cosmetics",
    url: "https://imo1.vercel.app/"
  },
  "sophie_bluel": {
    name: "Sophie Bluel",
    category: "Architect Portfolio",
    year: "2024",
    image: "/projets/sophie1.png", 
    description: "Portfolio architectural digital interactif. L'interface s'efface pour laisser la place aux volumes et aux espaces créés par l'architecte.",
    client: "Sophie Bluel",
    url: "https://franckchapelon.com/projets/all_projets/sophie_bluel"
  },
  "moviesdb": {
    name: "MoviesDB",
    category: "Web Application",
    year: "2024",
    image: "/projets/movie1.jpg", 
    description: "Une application web cinématique offrant une base de données exhaustive avec une interface fluide inspirée des meilleures plateformes de streaming.",
    client: "Personal Project",
    url: "https://franckchapelon.com/projets/all_projets/moviesdb"
  }
};

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const project = projectsData[resolvedParams.slug];

  if (!project) {
    notFound();
  }

  const shortYear = project.year.slice(-2);
  const projectIndex = Object.keys(projectsData).indexOf(resolvedParams.slug) + 1;
  const formattedIndex = projectIndex.toString().padStart(2, '0');

  const projectsArray = Object.entries(projectsData).map(([key, p]) => ({
    id: key,
    name: p.name,
    year: p.year,
    category: p.category,
    image: p.image,
  }));

  return (
    <I18nProvider>
      <main className="min-h-screen bg-white text-black w-full selection:bg-[#1A2E22] selection:text-white overflow-x-hidden font-sans">
        
        {/* Header Global Injecté */}
        <Header projectName={project.name} shortYear={shortYear} projectIndex={formattedIndex} />

        {/* Top Image Boxed (Screenshot 1) */}
        <section className="w-full px-4 md:px-6 pt-12 md:pt-12">
        <div className="w-full h-[60vh] md:h-[70vh] relative bg-[#F5F5F5]">
          <Image src={project.images?.hero || project.image} alt="Hero" fill className="object-cover" priority />
        </div>
      </section>

      {/* Main Info Grid (Screenshot 1) */}
      <section className="w-full px-4 md:px-6 py-8 md:py-8 flex flex-col lg:flex-row gap-12 lg:gap-8 max-w-[2400px] mx-auto ">
        {/* Left: Huge Title */}
        <div className="w-full lg:w-[40%] flex flex-col">
           <h1 className="text-5xl md:text-[5rem] lg:text-[6rem] font-sans font-normal tracking-tight leading-[1]">
              {project.name}®
           </h1>
           <span className="text-4xl md:text-[4rem] lg:text-[5rem] font-sans font-normal text-black/40 leading-[1] mt-2">
              SC_{formattedIndex}©{shortYear}
           </span>
        </div>



        {/* Right: Meta Grid */}
        <div className="w-full lg:w-[60%] grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 pt-2">
          
          {/* Areas */}
          <div className="md:col-span-3 flex flex-col">
            <h4 className="text-xs md:text-sm font-sans font-medium pb-2 mb-4 border-b border-black/10">Areas</h4>
            <ul className="text-sm md:text-base font-sans text-black/50 flex flex-col gap-1">
              <li>{project.category}</li>
              <li>UX</li>
              <li>UI</li>
              <li>Development</li>
            </ul>
          </div>

          {/* Overview */}
          <div className="md:col-span-5 flex flex-col md:pr-8">
            <h4 className="text-xs md:text-sm font-sans font-medium pb-2 mb-4 border-b border-black/10">Overview</h4>
            <p className="text-sm md:text-base font-sans text-black/50 leading-[1.6]">
              {project.description}
            </p>
          </div>

          {/* Credits & Links */}
          <div className="md:col-span-4 flex flex-col gap-8 md:pl-4">
            <div className="flex flex-col">
              <h4 className="text-xs md:text-sm font-sans font-medium pb-2 mb-4 border-b border-black/10">Credits</h4>
              <ul className="text-sm md:text-base font-sans text-black/50 flex flex-col gap-1">
                <li>Franck Chapelon (Dev)</li>
              </ul>
            </div>
            <div className="flex flex-col">
              <h4 className="text-xs font-sans font-medium pb-2 mb-4 border-b border-black/10">Links</h4>
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-sm font-sans text-black/50 hover:text-black transition-colors flex items-center gap-1 w-max">
                Live website <span className="text-[10px]">↗</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* Dynamic Presentation Section (Background color + Large Image) */}
      <section 
         className="w-full py-16 md:py-32 px-4 md:px-12 flex items-center justify-center transition-colors duration-500"
         style={{ backgroundColor: project.themeColor || '#F5F5F5' }}
      >
         <div className="relative w-full max-w-[2000px] h-[50vh] md:h-[85vh]">
            <Image 
               src={project.images?.presentation || project.image} 
               alt="Project Presentation" 
               fill 
               className="object-cover" 
            />
         </div>
      </section>

      {/* Brief Section 50/50 Split (Screenshot 3) */}
      <section className="w-full flex flex-col lg:flex-row h-auto lg:h-[70vh]">
        <div className="w-full lg:w-1/2 flex flex-col gap-8 p-6 lg:p-16 lg:pr-32">
           <h3 className="text-sm font-sans font-medium">Brief</h3>
           <p className="text-xl md:text-[2rem] font-sans text-black leading-[1.3] font-normal tracking-tight">
             L'objectif de ce projet était de concevoir un site web servant de plateforme complète pour {project.client}. Le cahier des charges comprenait l'intégration fluide des éléments de marque tout en créant un système de navigation très intuitif permettant d'explorer le contenu et les valeurs de la marque sans effort.
           </p>
        </div>
        <div className="w-full lg:w-1/2 bg-[#1A2E22] flex items-center justify-center py-32 lg:py-0 border-t lg:border-t-0 lg:border-l border-black/10">
           <h2 className="text-white text-4xl md:text-5xl font-sans font-medium tracking-tight">
              {project.name}®
           </h2>
        </div>
      </section>

      {/* Feature Grid (Screenshot 4) */}
      <section className="w-full p-4 md:p-8 bg-white border-b border-black/10 max-w-[2400px] mx-auto">
         <div className="flex items-center gap-2 mb-8">
            <div className="w-3 h-3 rounded-full bg-[#1A2E22]"></div>
            <h3 className="text-lg font-sans font-medium">Featured products</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item, idx) => {
                const featureImg = project.images?.features?.[idx] || project.image;
                return (
                <div key={item} className="flex flex-col border border-black/10 bg-white">
                   <div className="relative w-full aspect-[4/5] bg-[#F9F9F9]">
                      <Image src={featureImg} alt={`Feature ${item}`} fill className="object-cover opacity-60 mix-blend-multiply p-8" />
                   </div>
                   <div className="p-4 border-t border-black/10 flex justify-between items-center">
                      <span className="text-xs font-sans font-medium uppercase tracking-wide">Product {item}</span>
                      <span className="text-lg">+</span>
                   </div>
                </div>
             )})}
         </div>
         <div className="mt-12 mb-8">
            <button className="px-6 py-3 rounded-full border border-black text-[10px] font-sans font-medium uppercase hover:bg-black hover:text-white transition-colors">
               VIEW ALL OUR PRODUCTS
            </button>
         </div>
      </section>

      {/* Huge Text Parallax Area (Screenshot 10) */}
      <section className="w-full px-4 md:px-8 h-[120dvh] md:h-[130dvh] relative flex items-center justify-center border-b border-black/10 overflow-hidden">
         <Image src={project.images?.parallax || project.image} alt="Background" fill className="object-cover opacity-20 scale-105 blur-sm" />
         <h2 className="text-3xl md:text-[5rem] font-sans font-normal leading-[1.1] text-center max-w-[90%] relative z-10 tracking-tight">
           We are here to deliver you the best available nature-based therapeutics the world's leading experts have to offer.
         </h2>
      </section>

      {/* Massive Text Section (Creative Concept) (Screenshot 5) */}
      <section className="w-full px-4 md:px-8 py-24 md:py-40 flex flex-col lg:flex-row gap-8 lg:gap-16 max-w-[2400px] mx-auto border-b border-black/10">
        <div className="w-full lg:w-[15%]">
          <h3 className="text-sm font-sans font-medium">Creative Concept</h3>
        </div>
        <div className="w-full lg:w-[85%] pr-0 md:pr-12">
          <p className="text-3xl md:text-[3.5rem] lg:text-[4rem] font-sans text-black leading-[1.1] font-normal tracking-tight">
            The brand home for {project.client} represents a harmonious blend of aesthetics, scientific precision, and holistic wellness principles, brought to life through an immersive online experience. By aligning with the company's mission while leveraging existing assets, we have created a platform that educates, inspires, and empowers users.
          </p>
        </div>
      </section>

      {/* 4-Column Showcase (Screenshot 8) */}
      <section className="w-full p-4 md:p-8 bg-[#F5F5F5] border-b border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {/* Card 1 */}
           <div className="aspect-[1/2] relative border border-black/10 bg-white">
              <Image src={project.images?.showcase?.[0] || project.image} alt="Showcase 1" fill className="object-cover p-4" />
           </div>
           {/* Card 2 */}
           <div className="aspect-[1/2] relative border border-black/10 bg-white p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center border-b border-black/10 pb-4">
                 <span className="font-sans font-medium text-sm">{project.name}®</span>
                 <span className="text-[10px] uppercase">Menu</span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <h2 className="text-[10rem] leading-none font-sans font-medium text-[#1A2E22] tracking-tighter">03</h2>
                 <p className="text-xl font-sans font-normal px-4">We use FSC-certified cardboard</p>
              </div>
           </div>
           {/* Card 3 */}
           <div className="aspect-[1/2] relative border border-black/10 bg-[#FFB58A] p-6 flex flex-col">
              <div className="flex justify-between items-center border-b border-black/10 pb-4">
                 <span className="font-sans font-medium text-sm">{project.name}®</span>
                 <span className="text-[10px] uppercase">Menu</span>
              </div>
              <div className="mt-8 text-center">
                 <h3 className="text-3xl font-sans font-medium text-[#0A2342] uppercase tracking-tighter leading-none">GLUTATHIONE<br/>ADVANCED</h3>
              </div>
              <div className="flex-1 relative mt-4">
                 <Image src={project.images?.showcase?.[1] || project.image} alt="Bottle" fill className="object-cover opacity-60" />
              </div>
           </div>
           {/* Card 4 */}
           <div className="aspect-[1/2] relative bg-[#1A2E22] text-white flex flex-col">
              <div className="flex justify-between items-center border-b border-white/20 p-6">
                 <span className="font-sans font-medium text-sm">{project.name}®</span>
                 <span className="text-[10px] uppercase opacity-70">Menu</span>
              </div>
              <div className="px-6 py-4 flex flex-col h-full">
                 <h2 className="text-[6rem] font-sans font-normal uppercase leading-none tracking-tighter mb-8">ELLO</h2>
                 <h4 className="text-lg font-sans font-medium mb-2">{project.client}</h4>
                 <p className="text-xs font-sans opacity-70 mb-auto">167 Bree Street<br/>Cape Town, 8001</p>
                 
                 <div className="w-full mt-8">
                   <div className="border-t border-white/20 py-4 text-xs font-sans">Name</div>
                   <div className="border-t border-white/20 py-4 text-xs font-sans">Email</div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Screenshot 12: Dark Green Split List */}
      <section className="w-full flex flex-col lg:flex-row bg-[#1A2E22] text-white">
        <div className="w-full lg:w-1/2 p-8 lg:p-24 flex flex-col justify-between">
          <h2 className="text-[12rem] font-sans leading-none font-medium mb-12 tracking-tighter">06</h2>
          <div>
            <h3 className="text-4xl md:text-[3.5rem] font-sans font-medium leading-[1.1] mb-8 tracking-tight">
              Constant state of self-improvement and assessment.
            </h3>
            <p className="text-sm font-sans opacity-80 leading-[1.6] max-w-[80%]">
              We are in a constant pursuit of self-betterment to ensure market-leading products. It is our intention to continually strive for improved ways of delivering, operating, and being.
            </p>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-8 lg:p-24 flex flex-col gap-0 border-t lg:border-t-0 lg:border-l border-white/20">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <span className="text-sm font-sans font-medium">Here's how we're tackling it:</span>
          </div>
          {[
            "Environmental regeneration through tree planting.",
            "Packaging that's fully recyclable.",
            "Removal of single-use forever items.",
            "Working with environmentally responsible partners.",
            "Education and awareness programs."
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-6 border-b border-white/20 text-sm font-sans">
              <span>{item}</span>
              <span className="opacity-50">0{idx + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Massive Bottom Image (Screenshot 13) */}
      <section className="w-full h-[120dvh] md:h-[130dvh] relative p-4">
        <div className="w-full h-full relative bg-[#F5F5F5]">
           <Image src={project.images?.bottom || project.image} alt="Bottom Showcase" fill className="object-cover" />
        </div>
      </section>

      {/* Works List Footer (Interactive Client Component) */}
      <WorksFooter projects={projectsArray} />

      </main>
    </I18nProvider>
  );
}

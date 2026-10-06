import { useEffect, useMemo, useState } from "react";
import { CFG, IMG, LOGO, CUIS, FIELDS, S } from "./data";
import "./index.css";

const Logo = () => (
  <img src={LOGO} alt="SISCO Catering" width="122" height="54" />
);

const unique = (items) => [...new Set((items || []).filter(Boolean))];

export default function App() {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("l") || "en";
    } catch {
      return "en";
    }
  });
  const [open, setOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [sending, setSending] = useState(false);

  const ar = lang === "ar";
  const T = (key) => S?.[lang]?.[key] ?? "";
  const L = (value) => value?.[ar ? 1 : 0] || "";
  const wa = `https://wa.me/${CFG.wa}`;
  const profileAsset = (name) => `${import.meta.env.BASE_URL}images/${name}`;

  const imagePool = useMemo(
    () => unique(Object.values(IMG || {}).filter((value) => typeof value === "string")),
    []
  );

  const pickImage = (...keys) => {
    for (const key of keys) {
      if (key && IMG?.[key]) return IMG[key];
    }
    return null;
  };

  const serviceCards = useMemo(() => {
    const fallback = imagePool;
    return [
      {
        number: "01",
        title: ["Project Catering", "تموين المشاريع"],
        text: [
          "Meal programs scaled to your project and schedule.",
          "برامج وجبات مصممة لتناسب حجم مشروعك وجدوله التشغيلي.",
        ],
        image:
          pickImage("project", "catering", "industrial", "food") ||
          fallback[0] ||
          "",
      },
      {
        number: "02",
        title: ["Workforce Dining", "إعاشة القوى العاملة"],
        text: [
          "Balanced daily menus for large workforce communities.",
          "قوائم يومية متوازنة لمجتمعات القوى العاملة الكبيرة.",
        ],
        image:
          pickImage("workforce", "dining", "camp", "meal") ||
          fallback[1] ||
          fallback[0] ||
          "",
      },
      {
        number: "03",
        title: ["Remote-Site Catering", "تموين المواقع النائية"],
        text: [
          "Mobile kitchens and organized delivery logistics.",
          "مطابخ متنقلة وخدمات توصيل ولوجستيات منظمة للمواقع النائية.",
        ],
        image:
          pickImage("remote", "logistics", "kitchen", "site") ||
          fallback[2] ||
          fallback[0] ||
          "",
      },
    ];
  }, [imagePool]);

  const heroSlides = useMemo(() => {
    const slideImages = unique([
      pickImage("hero", "catering", "food"),
      serviceCards[0]?.image,
      serviceCards[1]?.image,
      serviceCards[2]?.image,
      ...imagePool,
    ]).slice(0, 4);

    const copy = [
      {
        eyebrow: ["SISCO CATERING", "سيسكو للتموين"],
        title: [
          "Catering that keeps complex operations moving.",
          "تموين يحافظ على سير العمليات المعقدة بكفاءة.",
        ],
        text: [
          "Reliable food service for projects, workforce communities and remote sites across Saudi Arabia.",
          "خدمات تموين موثوقة للمشاريع ومجتمعات القوى العاملة والمواقع النائية في المملكة العربية السعودية.",
        ],
      },
      {
        eyebrow: ["PROJECT CATERING", "تموين المشاريع"],
        title: [
          "Built around your project, schedule and people.",
          "مصمم حول مشروعك وجدولك وفريقك.",
        ],
        text: [
          "Structured meal programs with dependable service from mobilization through daily operations.",
          "برامج وجبات منظمة وخدمة موثوقة من مرحلة التجهيز وحتى التشغيل اليومي.",
        ],
      },
      {
        eyebrow: ["WORKFORCE DINING", "إعاشة القوى العاملة"],
        title: [
          "Daily dining designed for large communities.",
          "وجبات يومية مصممة للمجتمعات الكبيرة.",
        ],
        text: [
          "Balanced menus, consistent quality and organized service for workforce accommodation.",
          "قوائم متوازنة وجودة ثابتة وخدمة منظمة لسكن القوى العاملة.",
        ],
      },
      {
        eyebrow: ["REMOTE SITES", "المواقع النائية"],
        title: [
          "Reliable catering where access is difficult.",
          "تموين موثوق حتى في المواقع صعبة الوصول.",
        ],
        text: [
          "Mobile kitchens and coordinated logistics for challenging project locations.",
          "مطابخ متنقلة ولوجستيات منسقة للمواقع والمشاريع ذات الظروف الصعبة.",
        ],
      },
    ];

    return slideImages.map((image, index) => ({
      image,
      ...copy[index % copy.length],
    }));
  }, [imagePool, serviceCards]);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = ar ? "rtl" : "ltr";
    document.title = ar
      ? "سيسكو للتموين | خدمات التموين والضيافة"
      : "SISCO Catering | Catering & Hospitality";
    try {
      localStorage.setItem("l", lang);
    } catch {}
  }, [lang, ar]);

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const timer = setInterval(() => {
      setSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const changeSlide = (direction) => {
    if (!heroSlides.length) return;
    setSlide((current) =>
      (current + direction + heroSlides.length) % heroSlides.length
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const next = {};

    FIELDS.forEach(([id, , , type, required]) => {
      const el = form.elements[id];
      if (!el) return;
      const value = el.value.trim();

      if (required && !value) next[id] = T("req") || "Required";
      if (
        value &&
        type === "email" &&
        !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)
      ) {
        next[id] = T("inv") || "Invalid email";
      }
    });

    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    setStatus("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      form.reset();
      setStatus(T("ok") || "Thank you. We’ll contact you shortly.");
    } catch {
      setStatus(T("bad") || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const nav = [
    [ar ? "الرئيسية" : "Home", "top"],
    [ar ? "من نحن" : "About", "about"],
    [ar ? "خدماتنا" : "Services", "services"],
    [ar ? "القطاعات" : "Sectors", "sectors"],
    [ar ? "المطبخ" : "Cuisine", "cuisine"],
    [ar ? "تواصل معنا" : "Contact", "contact"],
  ];

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container nav-row">
          <a className="brand" href="#top" aria-label="SISCO Catering">
            <Logo />
          </a>

          <nav className={open ? "nav open" : "nav"}>
            {nav.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
                {label}
              </a>
            ))}
            <button
              className="lang-btn"
              type="button"
              onClick={() => setLang(ar ? "en" : "ar")}
            >
              {ar ? "EN" : "العربية"}
            </button>
          </nav>

          <a className="top-cta" href="#contact">
            {ar ? "اطلب عرضاً" : "Request a Quote"}
          </a>

          <button
            className="menu-btn"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="top">
          <div className="hero-stage">
            {heroSlides.map((item, index) => (
              <div
                key={`${item.image}-${index}`}
                className={index === slide ? "hero-slide is-active" : "hero-slide"}
                aria-hidden={index !== slide}
              >
                <img src={item.image} alt="" />
              </div>
            ))}
          </div>
          <div className="hero-shade" />

          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="kicker">{L(heroSlides[slide]?.eyebrow)}</p>
              <h1>{L(heroSlides[slide]?.title)}</h1>
              <p className="hero-text">{L(heroSlides[slide]?.text)}</p>

              <div className="hero-actions">
                <a className="button primary" href="#contact">
                  {ar ? "اطلب عرضاً" : "Request a Quote"}
                </a>
                <a className="button secondary" href="#services">
                  {ar ? "استكشف خدماتنا" : "Explore Services"}
                </a>
              </div>
            </div>

            {heroSlides.length > 1 && (
              <div className="hero-nav" aria-label="Hero slider navigation">
                <div className="hero-counter">
                  <strong>{String(slide + 1).padStart(2, "0")}</strong>
                  <span>/</span>
                  <span>{String(heroSlides.length).padStart(2, "0")}</span>
                </div>

                <div className="hero-progress" aria-hidden="true">
                  {heroSlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={index === slide ? "progress-item active" : "progress-item"}
                      onClick={() => setSlide(index)}
                      aria-label={`Show slide ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="hero-arrows">
                  <button
                    type="button"
                    onClick={() => changeSlide(-1)}
                    aria-label="Previous slide"
                  >
                    {ar ? "→" : "←"}
                  </button>
                  <button
                    type="button"
                    onClick={() => changeSlide(1)}
                    aria-label="Next slide"
                  >
                    {ar ? "←" : "→"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="proof-strip" aria-label="Company highlights">
          <div className="container proof-grid">
            <div><strong>28,000+</strong><span>{ar ? "وجبة يومياً" : "meals served daily"}</span></div>
            <div><strong>HACCP</strong><span>{ar ? "معايير سلامة الغذاء" : "food safety standards"}</span></div>
            <div><strong>ISO</strong><span>9001 · 22000 · 14001 · 45001</span></div>
            <div><strong>8,000+</strong><span>{ar ? "مقيم في مواقع متعددة" : "residents supported"}</span></div>
          </div>
        </section>

        <section className="clients-strip" aria-label="Clients and partners">
          <div className="container clients-inner">
            <div className="clients-heading">
              <p className="kicker dark">{ar ? "عملاؤنا وشركاؤنا" : "CLIENTS & PARTNERS"}</p>
              <p>{ar ? "جهات بارزة ظهرت في ملف الشركة." : "Selected organizations featured in the company profile."}</p>
            </div>
            <div className="clients-logos-wrap">
              <img src={profileAsset("client-logos.png")} alt={ar ? "شعارات العملاء والشركاء" : "Selected client and partner logos"} loading="lazy" />
            </div>
          </div>
        </section>

        <section className="section about" id="about">
          <div className="container split">
            <div className="section-title">
              <p className="kicker dark">{ar ? "من نحن" : "WHO WE ARE"}</p>
              <h2>{T("ab") || (ar ? "تموين موثوق للمشاريع الكبيرة" : "Catering built for demanding operations")}</h2>
            </div>
            <div className="section-copy">
              <p>
                {T("abp") ||
                  (ar
                    ? "نقدم خدمات تموين وضيافة منظمة وموثوقة مع تركيز على الجودة والسلامة واستمرارية التشغيل."
                    : "We provide dependable catering and hospitality with a clear focus on quality, food safety and consistent daily operations.")}
              </p>
              <a className="text-link" href="#services">
                {ar ? "عرض الخدمات" : "View our services"} <span>→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="section services" id="services">
          <div className="container">
            <div className="section-head-simple">
              <div>
                <p className="kicker dark">{ar ? "خدماتنا" : "OUR SERVICES"}</p>
                <h2>{ar ? "خدمات واضحة. تنفيذ موثوق." : "Simple services. Reliable delivery."}</h2>
              </div>
              <p>
                {ar
                  ? "حلول تموين عملية للمشاريع ومجتمعات القوى العاملة والمواقع البعيدة."
                  : "Practical catering solutions for projects, workforce communities and remote locations."}
              </p>
            </div>

            <div className="service-grid visual-services">
              {serviceCards.map((service) => (
                <article className="service-card visual-service-card" key={service.number}>
                  <div className="service-photo-wrap">
                    {service.image && (
                      <img src={service.image} alt={L(service.title)} loading="lazy" />
                    )}
                    <span className="service-number">{service.number}</span>
                  </div>
                  <div className="service-content">
                    <h3>{L(service.title)}</h3>
                    <p>{L(service.text)}</p>
                    <a className="service-link" href="#contact">
                      {ar ? "ناقش مشروعك" : "Discuss your project"} <span>↗</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section sectors" id="sectors">
          <div className="container">
            <div className="section-head-simple">
              <div>
                <p className="kicker dark">{ar ? "القطاعات والمشاريع" : "SECTORS & PROJECTS"}</p>
                <h2>{ar ? "مصمم للعمليات الصناعية والمواقع البعيدة" : "Built for industrial operations and remote sites"}</h2>
              </div>
              <p>{ar ? "ندعم قطاعات النفط والغاز والطاقة والإنشاءات والبتروكيماويات والتعدين والجهات الحكومية عبر المملكة." : "We support oil & gas, energy, construction, petrochemical, mining and government operations across Saudi Arabia."}</p>
            </div>

            <div className="sector-grid">
              {[
                { image: "sector-catering.jpg", title: ["Industrial Catering", "التموين الصناعي"], text: ["High-volume catering for complex industrial and project environments.", "تموين عالي السعة لبيئات المشاريع والعمليات الصناعية المعقدة."] },
                { image: "sector-housing.jpg", title: ["Workforce Communities", "مجتمعات القوى العاملة"], text: ["Integrated dining and accommodation support for large workforce communities.", "دعم متكامل للإعاشة والسكن لمجتمعات القوى العاملة الكبيرة."] },
                { image: "sector-facility.jpg", title: ["Facility Support", "دعم المرافق"], text: ["Facility management and operational support delivered alongside catering services.", "إدارة مرافق ودعم تشغيلي متكامل إلى جانب خدمات التموين."] },
              ].map((item) => (
                <article className="sector-card" key={item.image}>
                  <img src={profileAsset(item.image)} alt={L(item.title)} loading="lazy" />
                  <div className="sector-card-overlay">
                    <h3>{L(item.title)}</h3>
                    <p>{L(item.text)}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="project-network">
              <div className="project-network-image">
                <img src={profileAsset("project-network.png")} alt={ar ? "شبكة مشاريع سيسكو" : "SISCO strategic project network"} loading="lazy" />
              </div>
              <div className="project-network-copy">
                <p className="kicker dark">{ar ? "شبكة المشاريع" : "PROJECT NETWORK"}</p>
                <h3>{ar ? "تغطية تشغيلية في مواقع رئيسية" : "Operational coverage across key project locations"}</h3>
                <p>{ar ? "يشير ملف الشركة إلى عمليات في الجبيل والخبر/الدمام ورأس تنورة وطريف وشمال وجنوب الجفورة ومواقع أخرى." : "The company profile highlights operations in Jubail, Khobar/Dammam, Ras Tanura, Turaif, North and South Jafurah, and other locations."}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="statement-band">
          <div className="container statement-inner">
            <p className="kicker">{ar ? "لماذا سيسكو" : "WHY SISCO"}</p>
            <h2>
              {ar
                ? "الجودة في الطعام مهمة. الاتساق في كل يوم أهم."
                : "Good food matters. Consistency every day matters more."}
            </h2>
          </div>
        </section>

        <section className="section cuisine" id="cuisine">
          <div className="container">
            <div className="section-head-simple">
              <div>
                <p className="kicker dark">{ar ? "المطبخ" : "OUR CUISINE"}</p>
                <h2>{ar ? "قوائم مرنة وتجربة طعام مناسبة لكل موقع" : "Flexible menus with a stronger food experience"}</h2>
              </div>
              <p>{ar ? "نقدم قوائم متنوعة مصممة وفق متطلبات العميل والاحتياجات الثقافية والغذائية، مع خيارات للبوفيه والفعاليات والمطابخ المتنقلة." : "Menus are tailored to client needs, cultural preferences and dietary requirements, with buffet, event and mobile-kitchen formats available."}</p>
            </div>

            <div className="cuisine-photo-grid">
              {[
                { image: "cuisine-buffet.jpg", title: ["Buffet & High-Volume Dining", "البوفيه والإعاشة عالية السعة"], text: ["Large-scale service supported by experienced culinary and hospitality teams.", "خدمة واسعة النطاق تدعمها فرق طهي وضيافة ذات خبرة."] },
                { image: "cuisine-kitchen.jpg", title: ["Professional Kitchen Operations", "عمليات المطابخ الاحترافية"], text: ["Structured kitchen operations designed around hygiene, consistency and output.", "عمليات مطابخ منظمة تركز على النظافة والثبات وكفاءة الإنتاج."] },
                { image: "cuisine-events.jpg", title: ["Events & Banqueting", "الفعاليات والولائم"], text: ["Custom menus, elegant setups, live stations and trained service crews.", "قوائم مخصصة وتجهيزات راقية ومحطات حية وفرق خدمة مدربة."] },
              ].map((item) => (
                <article className="cuisine-photo-card" key={item.image}>
                  <img src={profileAsset(item.image)} alt={L(item.title)} loading="lazy" />
                  <div>
                    <h3>{L(item.title)}</h3>
                    <p>{L(item.text)}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="cuisine-tags">
              {CUIS.slice(0, 6).map((item) => (
                <span key={L(item)}>{L(item)}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="section client-confidence">
          <div className="container">
            <div className="section-head-simple">
              <div>
                <p className="kicker dark">{ar ? "ثقة العملاء" : "CLIENT CONFIDENCE"}</p>
                <h2>{ar ? "سجل تشغيلي يخدم مشاريع كبيرة ومعقدة" : "Operational proof instead of placeholder testimonials"}</h2>
              </div>
              <p>{ar ? "لم يتضمن ملف الشركة شهادات عملاء معتمدة للاقتباس، لذلك استخدمنا حقائق موثقة من الملف بدلاً من اختلاق اقتباسات." : "The company profile does not include approved client quotations, so this section uses documented proof points instead of invented testimonials."}</p>
            </div>
            <div className="confidence-grid">
              <article><strong>01</strong><h3>{ar ? "شراكات موثوقة" : "Trusted partnerships"}</h3><p>{ar ? "يذكر الملف أن سيسكو شريك موثوق لأرامكو وسابك ومعادن والقدية ونيوم وغيرهم." : "The profile names Saudi Aramco, SABIC, Maaden, Qiddiya, NEOM and others among trusted partners."}</p></article>
              <article><strong>02</strong><h3>{ar ? "مشاريع صناعية رئيسية" : "Critical industrial sites"}</h3><p>{ar ? "خبرة تشغيلية في الجبيل ورأس تنورة والجفورة وطريف والخبر/الدمام ومواقع أخرى." : "Operational experience across Jubail, Ras Tanura, Jafurah, Turaif, Khobar/Dammam and other sites."}</p></article>
              <article><strong>03</strong><h3>{ar ? "حجم تشغيلي كبير" : "Large-scale capability"}</h3><p>{ar ? "أكثر من 28,000 وجبة يومياً ودعم سكني لأكثر من 8,000 مقيم وفق ملف الشركة." : "The profile reports 28,000+ meals served daily and housing support for 8,000+ residents."}</p></article>
            </div>
          </div>
        </section>

        <section className="strong-cta">
          <img src={profileAsset("cta-catering.jpg")} alt="" aria-hidden="true" />
          <div className="strong-cta-shade" />
          <div className="container strong-cta-content">
            <p className="kicker">{ar ? "ابدأ مشروعك معنا" : "START YOUR PROJECT WITH SISCO"}</p>
            <h2>{ar ? "هل تخطط لخدمة تموين لمشروع أو موقع أو مجتمع قوى عاملة؟" : "Planning catering for a project, site or workforce community?"}</h2>
            <p>{ar ? "شاركنا نطاق العمل وسنساعدك في تحديد نموذج الخدمة المناسب." : "Share your scope and requirements and our team can help shape the right service model."}</p>
            <a className="button primary" href="#contact">{ar ? "اطلب عرضاً" : "Request a Proposal"}</a>
          </div>
        </section>

        <section className="section contact" id="contact">
          <div className="container contact-grid">
            <div className="contact-copy">
              <p className="kicker">{ar ? "تواصل معنا" : "LET'S TALK"}</p>
              <h2>{ar ? "أخبرنا عن مشروعك." : "Tell us about your project."}</h2>
              <p>
                {ar
                  ? "أرسل تفاصيلك وسيتواصل فريقنا معك لمناقشة الحل المناسب."
                  : "Share a few details and our team will contact you to discuss the right catering solution."}
              </p>
              <div className="contact-details">
                <a href={`tel:${CFG.phone.replace(/[^\d+]/g, "")}`}>{CFG.phone}</a>
                <a href={`mailto:${CFG.email}`}>{CFG.email}</a>
                <a href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
              </div>
            </div>

            <form className="contact-form" onSubmit={submit} noValidate>
              {FIELDS.slice(0, 4).map(([id, english, arabic, type, required]) => (
                <div className="field" key={id}>
                  <label htmlFor={id}>{ar ? arabic : english}{required ? " *" : ""}</label>
                  {type === "select" ? (
                    <select id={id} name={id} required={!!required}>
                      <option value="">{T("fs") || "Select"}</option>
                      {(T("fo") || []).map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input id={id} name={id} type={type} required={!!required} />
                  )}
                  {errors[id] && <small>{errors[id]}</small>}
                </div>
              ))}

              <div className="field full">
                <label htmlFor="message">{ar ? "تفاصيل المشروع" : "Project details"}</label>
                <textarea id="message" name="message" rows="5" />
              </div>

              <div className="form-bottom full">
                <button className="button primary" type="submit" disabled={sending}>
                  {sending ? (T("sending") || "Sending...") : (ar ? "إرسال الطلب" : "Send Enquiry")}
                </button>
                {status && <span className="form-status">{status}</span>}
              </div>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-main-new">
          <div className="footer-brand-block">
            <a href="#top" className="footer-brand"><Logo /></a>
            <p>{ar ? "تموين صناعي وإعاشة وإدارة مرافق عبر المملكة العربية السعودية." : "Industrial catering, workforce housing and facility support across Saudi Arabia."}</p>
          </div>
          <div className="footer-links-group">
            <strong>{ar ? "روابط" : "Explore"}</strong>
            <a href="#about">{ar ? "من نحن" : "About"}</a>
            <a href="#services">{ar ? "الخدمات" : "Services"}</a>
            <a href="#sectors">{ar ? "القطاعات" : "Sectors"}</a>
            <a href="#cuisine">{ar ? "المطبخ" : "Cuisine"}</a>
          </div>
          <div className="footer-links-group">
            <strong>{ar ? "تواصل" : "Contact"}</strong>
            <a href={`tel:${CFG.phone.replace(/[^\d+]/g, "")}`}>{CFG.phone}</a>
            <a href={`mailto:${CFG.email}`}>{CFG.email}</a>
            <span>{L(CFG.city)}</span>
            <a href="https://www.siscosaudi.com" target="_blank" rel="noreferrer">www.siscosaudi.com</a>
          </div>
        </div>
        <div className="container footer-bottom-new">
          <span>© {new Date().getFullYear()} SISCO Catering</span>
          <span>{ar ? "الجودة · السلامة · الاستدامة" : "Quality · Safety · Sustainability"}</span>
        </div>
      </footer>
    </div>
  );
}

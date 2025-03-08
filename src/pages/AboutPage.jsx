import React from 'react';

const AboutPage = () => {
  return (
    <div className="about-page">
      <header className="page-header">
        <h1>Apie projektą</h1>
        <p className="subtitle">NT Analizė - Lietuvos nekilnojamojo turto rinkos duomenų portalas</p>
      </header>

      <div className="about-content">
        <section className="about-section">
          <h2>Projekto tikslas</h2>
          <p>
            NT Analizė - tai projektas, skirtas suteikti išsamią ir objektyvią informaciją apie
            Lietuvos nekilnojamojo turto rinką. Mūsų tikslas - padėti žmonėms priimti geresnius
            sprendimus perkant, parduodant ar investuojant į nekilnojamąjį turtą.
          </p>
          <p>
            Projektas sukurtas siekiant pateikti visuomenei atvirą prieigą prie NT rinkos duomenų
            analizės, kuri anksčiau buvo prieinama tik rinkos profesionalams. Mes tikime, kad
            skaidrumas ir duomenimis pagrįstos įžvalgos gali padėti sukurti sveikesnę ir efektyvesnę
            NT rinką Lietuvoje.
          </p>
        </section>

        <section className="about-section">
          <h2>Duomenų šaltiniai</h2>
          <p>
            Mūsų analizė remiasi duomenimis, surinktais iš viešai prieinamų šaltinių, įskaitant
            populiariausius Lietuvos nekilnojamojo turto skelbimų portalus. Duomenys yra reguliariai
            atnaujinami, siekiant užtikrinti aktualią informaciją.
          </p>
          <p>
            Svarbu pažymėti, kad mes renkame tik viešai prieinamą informaciją apie NT skelbimus,
            o ne asmeninę pardavėjų ar pirkėjų informaciją. Visi duomenys yra anonimizuojami ir
            naudojami tik statistinei analizei.
          </p>
        </section>

        <section className="about-section">
          <h2>Naudojamos technologijos</h2>
          <p>
            Projektas sukurtas naudojant modernias web technologijas:
          </p>
          <ul className="technologies-list">
            <li><strong>Frontend:</strong> React.js, React Router, Recharts, Leaflet</li>
            <li><strong>Backend:</strong> Node.js, Express, MongoDB</li>
            <li><strong>Duomenų surinkimas:</strong> Specialized web scraping tools</li>
            <li><strong>Duomenų analizė:</strong> Custom analytics algorithms</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Apie autorių</h2>
          <p>
            Šis projektas sukurtas Lietuvos IT specialisto, kuris domisi duomenų analize ir
            nekilnojamojo turto rinka. Projektas pradėtas kaip asmeninė iniciatyva, siekiant
            geriau suprasti NT rinkos tendencijas ir pasidalinti šiomis žiniomis su visuomene.
          </p>
        </section>

        <section className="about-section">
          <h2>Kontaktai</h2>
          <p>
            Jei turite klausimų, pastabų ar pasiūlymų dėl projekto, galite susisiekti el. paštu:
            <a href="mailto:info@nt-analize.lt"> info@nt-analize.lt</a>
          </p>
          <p>
            Taip pat galite sekti projekto naujienas mūsų <a href="https://github.com/tavo-username/nt-analize-app" target="_blank" rel="noopener noreferrer">GitHub</a> paskyroje.
          </p>
        </section>

        <section className="about-section disclaimer">
          <h2>Atsakomybės apribojimas</h2>
          <p>
            NT Analizė teikia informaciją tik informaciniais tikslais. Mes nesame nekilnojamojo
            turto brokeriai, vertintojai ar teisininkai, todėl mūsų pateikiama analizė neturėtų
            būti vienintelis pagrindas priimant svarbius finansinius sprendimus.
          </p>
          <p>
            Visada rekomenduojame pasikonsultuoti su NT srities profesionalais prieš priimant
            sprendimus, susijusius su nekilnojamojo turto pirkimu, pardavimu ar investavimu.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
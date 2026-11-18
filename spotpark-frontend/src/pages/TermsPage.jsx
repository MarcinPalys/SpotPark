import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import '../styles/terms.css';

const EFFECTIVE_DATE = '18 listopada 2026 r.';
const PENALTY = '100 zł';

const HIGHLIGHTS = [
  { icon: 'clock', title: '10 minut tolerancji', text: 'Po zakończeniu rezerwacji masz 10 minut na wyjazd bez dodatkowych opłat.' },
  { icon: 'card', title: `${PENALTY} kary`, text: 'Za niezwolnienie miejsca ponad 60 minut po czasie albo zablokowanie kolejnego kierowcy.' },
  { icon: 'calendar', title: 'Bezpłatne anulowanie', text: 'Do 24 godzin przed rozpoczęciem rezerwacji zwracamy 100% opłaty.' },
  { icon: 'shield', title: 'Bezpieczne płatności', text: 'Płacisz z góry przez Przelewy24. Gospodarz dostaje pieniądze po zakończeniu najmu.' },
];

const HOW_TO_RENT = [
  { title: 'Znajdź miejsce', text: 'Wpisz adres na stronie głównej albo kliknij na mapie. Wybierz datę i godziny.' },
  { title: 'Sprawdź ofertę', text: 'Zobacz zdjęcia, opis, cenę za godzinę i opinie innych kierowców.' },
  { title: 'Zarezerwuj i zapłać', text: 'Podaj numer rejestracyjny i opłać rezerwację przez Przelewy24.' },
  { title: 'Zaparkuj', text: 'Przyjedź w zarezerwowanym czasie i zajmij dokładnie wskazane miejsce.' },
  { title: 'Zwolnij na czas', text: 'Wyjedź przed końcem rezerwacji albo przedłuż ją w aplikacji, jeśli miejsce jest wolne.' },
];

const PENALTY_TABLE = [
  { when: 'do 10 minut po końcu rezerwacji', what: 'bez opłat (tolerancja)' },
  { when: 'od 11 do 60 minut', what: 'dopłata w wysokości podwójnej stawki godzinowej za każde rozpoczęte 30 minut' },
  { when: 'powyżej 60 minut', what: `kara umowna ${PENALTY} + dopłata jak wyżej za cały czas postoju` },
  { when: 'zablokowanie kolejnego kierowcy (niezależnie od czasu)', what: `kara umowna ${PENALTY} + koszt zapewnienia mu miejsca zastępczego, maks. 50 zł` },
  { when: 'każde kolejne pełne 24 godziny postoju', what: `dodatkowo ${PENALTY}` },
];

const SECTIONS = [
  {
    id: 'postanowienia-ogolne',
    title: 'Postanowienia ogólne',
    items: [
      'Regulamin określa zasady korzystania z serwisu internetowego SpotPark (dalej: „Serwis”), umożliwiającego krótkoterminowy wynajem prywatnych miejsc parkingowych na terenie Krakowa.',
      'Operatorem Serwisu jest [nazwa operatora, adres, NIP] (dalej: „Operator”). Kontakt z Operatorem: [adres e-mail kontaktowy].',
      'Operator pośredniczy w zawieraniu umów najmu pomiędzy Gospodarzami a Kierowcami. Stroną umowy najmu miejsca parkingowego są Gospodarz i Kierowca.',
      'Korzystanie z Serwisu oznacza akceptację Regulaminu. Rejestracja konta oraz dokonanie rezerwacji wymagają zaznaczenia zgody na jego treść.',
    ],
  },
  {
    id: 'definicje',
    title: 'Definicje',
    items: [
      <><strong>Użytkownik</strong> – pełnoletnia osoba fizyczna, osoba prawna lub jednostka organizacyjna posiadająca konto w Serwisie.</>,
      <><strong>Gospodarz</strong> – Użytkownik, który udostępnia w Serwisie miejsce parkingowe, do którego ma prawo do dysponowania.</>,
      <><strong>Kierowca</strong> – Użytkownik, który rezerwuje miejsce parkingowe.</>,
      <><strong>Miejsce</strong> – wskazane w ofercie miejsce postojowe (w garażu, na podjeździe, parkingu lub posesji).</>,
      <><strong>Rezerwacja</strong> – opłacone zamówienie najmu Miejsca na określony czas (Okres najmu).</>,
      <><strong>Opłata</strong> – kwota należna za Okres najmu, wyliczona na podstawie stawki godzinowej ustalonej przez Gospodarza.</>,
      <><strong>Kara umowna</strong> – kwota należna w przypadkach opisanych w § 8 Regulaminu.</>,
    ],
  },
  {
    id: 'konto',
    title: 'Konto Użytkownika',
    items: [
      'Rejestracja jest bezpłatna. Użytkownik podaje prawdziwe dane: imię, nazwisko i adres e-mail.',
      'Jedna osoba może posiadać tylko jedno konto. Konta nie można udostępniać innym osobom.',
      'Użytkownik odpowiada za zachowanie poufności hasła. O nieuprawnionym dostępie do konta należy niezwłocznie powiadomić Operatora.',
      'Operator może zawiesić lub usunąć konto Użytkownika, który rażąco lub uporczywie narusza Regulamin, w szczególności nie płaci kar umownych lub podaje nieprawdziwe informacje.',
    ],
  },
  {
    id: 'oferty',
    title: 'Dodawanie ofert przez Gospodarzy',
    items: [
      'Gospodarz oświadcza, że ma prawo do dysponowania Miejscem (np. jako właściciel, najemca za zgodą wynajmującego lub na podstawie uchwały wspólnoty) i że jego udostępnienie nie narusza praw osób trzecich.',
      'Oferta musi zawierać dokładną lokalizację, rzetelny opis i stawkę za godzinę. Zdjęcia muszą przedstawiać rzeczywiste Miejsce.',
      'Gospodarz ustala dostępność Miejsca i odpowiada za to, aby w czasie Rezerwacji było ono wolne i dostępne (np. otwarta brama, przekazany kod lub pilot).',
      'Jeżeli Kierowca nie może zaparkować z przyczyn leżących po stronie Gospodarza, otrzymuje pełny zwrot Opłaty, a Gospodarz zapłaci mu rekompensatę 50 zł. Powtarzające się przypadki mogą skutkować zawieszeniem oferty.',
      'Zabronione jest publikowanie ofert miejsc, którymi Gospodarz nie może dysponować, a także miejsc publicznych, kopert dla osób z niepełnosprawnościami i miejsc w strefach płatnego parkowania.',
    ],
  },
  {
    id: 'rezerwacja',
    title: 'Rezerwacja i najem miejsca',
    items: [
      'Kierowca wybiera Miejsce, datę oraz godzinę rozpoczęcia i zakończenia najmu. Minimalny Okres najmu wynosi 30 minut. Rezerwacji można dokonać do 30 dni naprzód.',
      'Przy rezerwacji Kierowca podaje numer rejestracyjny pojazdu. Na Miejscu może stać wyłącznie ten pojazd.',
      'Rezerwacja zostaje zawarta z chwilą zaksięgowania Opłaty. Kierowca otrzymuje potwierdzenie z adresem Miejsca i instrukcją dojazdu.',
      'Kierowca może przedłużyć Rezerwację w Serwisie, jeżeli Miejsce nie jest zarezerwowane przez inną osobę. Przedłużenie wymaga dopłaty według stawki z oferty.',
      'Wcześniejszy wyjazd nie uprawnia do zwrotu części Opłaty.',
    ],
  },
  {
    id: 'platnosci',
    title: 'Płatności',
    items: [
      'Opłata pobierana jest z góry, w całości, za pośrednictwem operatora płatności Przelewy24.',
      'Operator pobiera prowizję w wysokości 15% Opłaty. Pozostała kwota zostaje wypłacona Gospodarzowi w terminie 7 dni od zakończenia Okresu najmu, na wskazany przez niego rachunek bankowy.',
      'Dopłaty i kary umowne, o których mowa w § 8, Operator pobiera z metody płatności użytej przy rezerwacji. Jeżeli nie jest to możliwe, Kierowca otrzymuje wezwanie do zapłaty z 7-dniowym terminem.',
      'Ceny podawane w Serwisie są cenami brutto w złotych polskich.',
    ],
  },
  {
    id: 'obowiazki',
    title: 'Obowiązki Kierowcy',
    items: [
      'Kierowca parkuje wyłącznie na zarezerwowanym Miejscu, w sposób niezakłócający korzystania z sąsiednich miejsc i dróg dojazdowych.',
      'Kierowca przestrzega zasad obowiązujących na terenie, na którym znajduje się Miejsce (np. regulaminu garażu, ograniczenia wysokości, zakazu palenia).',
      'Zabronione jest pozostawianie w Miejscu przedmiotów, przechowywanie materiałów niebezpiecznych, naprawy pojazdu i mycie go.',
      'Kierowca zwalnia Miejsce najpóźniej o godzinie zakończenia Rezerwacji.',
      'Zajęcie cudzego (niezarezerwowanego) miejsca na terenie Gospodarza skutkuje karą umowną w wysokości 100 zł.',
    ],
  },
  {
    id: 'kary',
    title: 'Niezwolnienie miejsca i kary umowne',
    lead: `Terminowe zwolnienie Miejsca jest kluczowe, bo po Tobie może przyjechać kolejny kierowca. Za przekroczenie czasu naliczamy opłaty według poniższej tabeli.`,
    table: true,
    items: [
      'Czas postoju ustala się na podstawie potwierdzenia wyjazdu w Serwisie, a w razie sporu na podstawie zdjęć lub nagrań z oznaczeniem daty i godziny, przekazanych przez Gospodarza lub Kierowcę.',
      `Kara umowna w wysokości ${PENALTY} należy się Gospodarzowi i nie wyklucza dochodzenia odszkodowania przenoszącego jej wysokość, jeżeli szkoda jest większa (np. utracona kolejna rezerwacja).`,
      'Jeżeli pojazd nie zostanie usunięty w ciągu 24 godzin od końca Rezerwacji, a kontakt z Kierowcą jest niemożliwy, Gospodarz może powiadomić właściwe służby (Straż Miejską lub Policję). Operator udostępni im dane niezbędne do identyfikacji pojazdu, zgodnie z przepisami prawa.',
      'Kara nie jest naliczana, jeżeli opóźnienie wynikło z przyczyn niezależnych od Kierowcy (np. awaria bramy, blokada wyjazdu przez inny pojazd, zdarzenie losowe potwierdzone dokumentami). Kierowca powinien niezwłocznie zgłosić taką sytuację przez Serwis.',
      'Kierowca może zakwestionować naliczoną karę w trybie reklamacji (§ 12) w terminie 14 dni od jej naliczenia.',
    ],
  },
  {
    id: 'anulowanie',
    title: 'Anulowanie rezerwacji',
    items: [
      'Kierowca może anulować Rezerwację w Serwisie: więcej niż 24 godziny przed jej rozpoczęciem – zwrot 100% Opłaty; od 24 do 2 godzin – zwrot 50% Opłaty; mniej niż 2 godziny przed rozpoczęciem – Opłata nie podlega zwrotowi.',
      'Gospodarz może anulować Rezerwację wyłącznie z ważnych przyczyn. W takim przypadku Kierowca otrzymuje pełny zwrot Opłaty. Częste anulowanie rezerwacji przez Gospodarza może skutkować zawieszeniem oferty.',
      'Zwrot następuje na rachunek, z którego dokonano płatności, w terminie do 14 dni.',
    ],
  },
  {
    id: 'odpowiedzialnosc',
    title: 'Odpowiedzialność',
    items: [
      'Operator udostępnia platformę do zawierania umów i nie jest stroną umowy najmu. Nie odpowiada za stan Miejsca ani za zachowanie Użytkowników, z zastrzeżeniem bezwzględnie obowiązujących przepisów prawa.',
      'Najem Miejsca nie jest umową przechowania. Gospodarz nie odpowiada za pojazd ani pozostawione w nim rzeczy, chyba że szkoda powstała z jego winy.',
      'Kierowca odpowiada za szkody wyrządzone na terenie Gospodarza, w tym w infrastrukturze garażu i pojazdach innych osób.',
    ],
  },
  {
    id: 'opinie',
    title: 'Opinie',
    items: [
      'Po zakończeniu Rezerwacji Kierowca może wystawić ocenę (1–5) i opinię o Miejscu.',
      'Opinie muszą dotyczyć rzeczywistego najmu i nie mogą zawierać treści obraźliwych ani danych osobowych. Operator może usuwać opinie naruszające te zasady.',
    ],
  },
  {
    id: 'reklamacje',
    title: 'Reklamacje',
    items: [
      'Reklamacje dotyczące działania Serwisu, Rezerwacji lub naliczonych opłat można składać na adres [adres e-mail kontaktowy] albo przez formularz w Serwisie.',
      'Reklamacja powinna zawierać dane Użytkownika, numer Rezerwacji, opis problemu i, jeżeli to możliwe, dowody (np. zdjęcia).',
      'Operator rozpatruje reklamację w terminie 14 dni od jej otrzymania i informuje o wyniku drogą elektroniczną.',
    ],
  },
  {
    id: 'dane-osobowe',
    title: 'Dane osobowe',
    items: [
      'Administratorem danych osobowych Użytkowników jest Operator. Dane przetwarzane są zgodnie z RODO, w celu świadczenia usług, rozliczeń i rozpatrywania reklamacji.',
      'Szczegółowe informacje o przetwarzaniu danych zawiera Polityka prywatności.',
    ],
  },
  {
    id: 'postanowienia-koncowe',
    title: 'Postanowienia końcowe',
    items: [
      'Operator może zmienić Regulamin z ważnych przyczyn (np. zmiana przepisów, nowe funkcje Serwisu). O zmianach Użytkownicy zostaną poinformowani z 14-dniowym wyprzedzeniem. Do rezerwacji zawartych przed zmianą stosuje się dotychczasowe zasady.',
      'Postanowienia Regulaminu nie wyłączają ani nie ograniczają uprawnień konsumentów wynikających z bezwzględnie obowiązujących przepisów prawa.',
      'W sprawach nieuregulowanych stosuje się przepisy prawa polskiego, w szczególności Kodeksu cywilnego. Konsument może skorzystać z pozasądowych sposobów rozpatrywania sporów.',
      `Regulamin obowiązuje od ${EFFECTIVE_DATE}`,
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="terms">
      <div className="container">
        <header className="terms-hero">
          <span className="terms-eyebrow">Zasady korzystania</span>
          <h1>Regulamin serwisu SpotPark</h1>
          <p>Obowiązuje od {EFFECTIVE_DATE} Przeczytaj najważniejsze zasady w skrócie albo przejdź do pełnej treści.</p>
        </header>

        <section className="terms-highlights" aria-label="Najważniejsze zasady w skrócie">
          {HIGHLIGHTS.map((h) => (
            <div key={h.title} className="terms-highlight">
              <span className="terms-highlight-icon"><Icon name={h.icon} size={22} /></span>
              <h2>{h.title}</h2>
              <p>{h.text}</p>
            </div>
          ))}
        </section>

        <section className="terms-howto" id="jak-wynajac">
          <h2>Jak wynająć miejsce?</h2>
          <ol>
            {HOW_TO_RENT.map((step, i) => (
              <li key={step.title}>
                <span className="terms-howto-number">{i + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/" className="btn btn-primary terms-howto-cta">
            Znajdź miejsce <Icon name="arrowRight" size={16} />
          </Link>
        </section>

        <div className="terms-layout">
          <nav className="terms-toc" aria-label="Spis treści">
            <span>Spis treści</span>
            <ol>
              {SECTIONS.map((s, i) => (
                <li key={s.id}><a href={`#${s.id}`}>§ {i + 1}. {s.title}</a></li>
              ))}
            </ol>
          </nav>

          <article className="terms-body">
            {SECTIONS.map((section, i) => (
              <section key={section.id} id={section.id} className={`terms-section${section.table ? ' terms-section-highlight' : ''}`}>
                <h2><span>§ {i + 1}.</span> {section.title}</h2>
                {section.lead && <p className="terms-lead">{section.lead}</p>}
                {section.table && (
                  <div className="terms-table-wrap">
                    <table className="terms-table">
                      <thead>
                        <tr><th>Przekroczenie czasu</th><th>Opłata</th></tr>
                      </thead>
                      <tbody>
                        {PENALTY_TABLE.map((row) => (
                          <tr key={row.when}><td>{row.when}</td><td>{row.what}</td></tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <ol className="terms-items">
                  {section.items.map((item, j) => <li key={j}>{item}</li>)}
                </ol>
              </section>
            ))}

            <p className="terms-note">
              Dokument przygotowany na potrzeby projektu inżynierskiego. Przed uruchomieniem serwisu
              należy uzupełnić dane Operatora i skonsultować treść z prawnikiem.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}

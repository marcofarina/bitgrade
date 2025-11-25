# BitGrade 🎓

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-19.0-61dafb.svg)
![TypeScript](https://img.shields.io/badge/typescript-5.0-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/tailwind-3.0-38bdf8.svg)

**BitGrade** è una web app moderna e intuitiva progettata per aiutare i docenti a calcolare i voti delle verifiche in modo rapido e preciso. L'applicazione supporta un sistema di valutazione differenziato basato sulla complessità della verifica, permettendo di mappare i punteggi su diversi massimali mantenendo coerente la soglia della sufficienza.

## ✨ Funzionalità Principali

*   **Design Moderno & Responsivo:** Interfaccia scura (Dark Mode) curata, con effetti glassmorphism e animazioni fluide (framer-motion).
*   **Configurazione Flessibile:** Imposta il punteggio totale della verifica all'avvio.
*   **3 Modalità di Calcolo:**
    *   **Livello Singolo:** Valutazione standard da 0 a 10.
    *   **Doppio Livello:** Distingue tra verifica Base (max 8) e Avanzata (max 10).
    *   **Triplo Livello:** Distingue tra Base (max 7.5), Intermedio (max 8.5) e Avanzato (max 10).
*   **Calcolo in Tempo Reale:** I voti vengono ricalcolati istantaneamente mentre digiti il punteggio.
*   **Visualizzazione Grafica:** Indicatori circolari animati per un feedback visivo immediato.

## 🧮 Logica di Calcolo

Il cuore dell'applicazione risiede nel suo algoritmo di rimappatura dei voti. Ecco come funziona:

### 1. Conversione Base
Tutti i calcoli partono dal punteggio grezzo ($P$) rapportato al totale ($T$) e convertito in decimi ($P_{10}$):
$$P_{10} = (P / T) \times 10$$

### 2. Soglia di Sufficienza
La sufficienza (voto 6) si raggiunge **sempre** ottenendo il 60% dei punti totali, indipendentemente dal livello di difficoltà.

### 3. Voto Minimo
Il voto minimo assegnabile è bloccato a **2**, anche per punteggi molto bassi.

### 4. Rimappatura dei Livelli
Se il voto in decimi è sufficiente ($P_{10} \ge 6$), il voto finale viene ricalcolato per adattarsi al massimale del livello specifico, secondo la formula:

$$Voto = 6 + (P_{10} - 6) \times \frac{MaxTarget - 6}{4}$$

#### Configurazione dei Livelli:

*   **1 Livello:**
    *   Mappatura standard 1:1 ($MaxTarget = 10$).
*   **2 Livelli:**
    *   *Base:* Mappato su $MaxTarget = 8$.
    *   *Avanzato:* Mappato su $MaxTarget = 10$.
*   **3 Livelli:**
    *   *Base:* Mappato su $MaxTarget = 7.5$.
    *   *Intermedio:* Mappato su $MaxTarget = 8.5$.
    *   *Avanzato:* Mappato su $MaxTarget = 10$.

## 🛠 Tech Stack

Il progetto è costruito utilizzando le più recenti tecnologie web:

*   **[React 19](https://react.dev/)**: Libreria UI per la costruzione dell'interfaccia.
*   **[TypeScript](https://www.typescriptlang.org/)**: Per un codice tipizzato e sicuro.
*   **[Tailwind CSS](https://tailwindcss.com/)**: Per lo styling utility-first.
*   **[Framer Motion](https://www.framer.com/motion/)**: Per le animazioni complesse e le transizioni di stato.
*   **[Lucide React](https://lucide.dev/)**: Per le icone vettoriali.

## 🚀 Installazione e Avvio

Per eseguire il progetto in locale:

1.  **Clona il repository:**
    ```bash
    git clone https://github.com/tuo-username/bitgrade.git
    cd bitgrade
    ```

2.  **Installa le dipendenze:**
    ```bash
    npm install
    # oppure
    yarn install
    ```

3.  **Avvia il server di sviluppo:**
    ```bash
    npm run dev
    ```

4.  Apri il browser all'indirizzo indicato (solitamente `http://localhost:5173`).

## 📄 Licenza

Questo progetto è distribuito sotto licenza **MIT**. Sentiti libero di usarlo, modificarlo e distribuirlo.

---

Sviluppato con ❤️ per semplificare la vita scolastica.
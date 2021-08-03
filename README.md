# Generowanie bloków

## Wprowadzenie teoretyczne
**Osobnik: genotyp + fenotyp**
Rozpoczyna się od **populacji początkowej**, czyli losowo wygenerowanych osobników.
Do oceny osobników służy **funkcja dopasowania.**
**Selekcja** następuje między kolejnymi krokami ewolucji.
**Krzyżowanie** dokonuje się na wyselekcjonowanych osobnikach.
**Mutacja** to rzadka, losowa zmiana pojedynczego genu.

## Uruchamianie

W folderze głównym należy uruchomić dowolny serwer HTTP (powód - CORS), na przykład `python2 -m SimpleHTTPServer 8000` lub `python3 -m http.server 8000`.
Po przejściu na stronę [`http://localhost:8000/main.html`](http://localhost:8000/main.html) aplikacja uruchomi się.

## Korzystanie

W oknie przeglądarki pojawi się dziesięć planów mieszkań, będących fenotypem, czyli reprezentacją genotypu. Plany można przesuwać przytrzymująć prawy przycisk myszy i przesuwając kursor. Obracanie przebiega wraz z wciśniętym lewym klawiszem myszy. Przy pomocy rolki można przybliżać i oddalać obraz.

W górnej części strony znajdują się przyciski: `Koniec`, `+1`, `+10` oraz `+100`. Pierwszy wybiera najlepszy genotyp (mający najwyższą ocenę) i przedstawia go. Pozostałe służą do przejścia do kolejnego pokolenia/kolejnych pokoleń. W konsoli deweloperskiej wypisywana jest informacja przy wyznaczeniu kolejnych pokoleń, przydatna do śledzenia postępu krzyżowania oraz mutacji osobników - ta może trochę potrwać przy wyborze przeskoku o 10 lub o 100 pokoleń.

Do działania aplikacji polecana jest przeglądarka Chrome.

## Technologie

Aplikacja do wyświetlania grafiki korzysta z biblioteki [Three.js](https://threejs.org/)

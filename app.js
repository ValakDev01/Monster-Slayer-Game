//7. piszemy funkjcę, która będzie losować liczbę z zadanego przedziału
//kodujemy ją w czystym JS, ponieważ nie ma sensu jej zagnieżdzać w obiekcie Vue, ponieważ
//nigdy nie będziemy jej żądać wprost tylko używać raz na jakiś czas. Innym dobrym przykładem na wytłumaczenie tego
//zagrania jest np. jak mamy zmienną w JS scope, czyli poza obiektem Vue i ją byśmy wciągneli do obiektu Vue i zmienili
//np. jej wartość to nigdy ta wartość nie zostanie edytowana na stałe, ponieważ ta zmienna nie jest w tym obiekcie i za każdym
//razem gdy ją pobieramy na nowo do obiektu to ma cały czas wartość domyślną przypisaną w JS scope. Jak by była ona w 
//obiekcie Vue zagnieżdzona to wtedy jej wartość stale by się zmieniała i zapisywała automatycznie nie tracać swojej value.
//Ta funkcja tutaj nie jest funkcją eventową na np. onclick, nie jest też to funkcja computed bo nie zagnieżdzamy jej
//nigdzie w kodzie i jej dane nie zależą od innych danych oraz nie jest to funkcja watch bo nie obserwuje niczego etc.
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//1. tworzymy obiekt Vue
Vue.createApp({
    //2. tworzymy metodę data() bo będziemy pracować na zmiennych i możemy od razu zadeklarować 2 zmienne z ilością zdrowia
    //playerHealth i monsterHealth
    data() {
        return {
            playerHealth: 100,
            monsterHealth: 100,
            //17. pierw robie zmienną na ilość rund
            currentRound: 0,
            //26. tworzymy zmienna, która będzie przechowywać nazwę zwycięzcy lub remis
            winner: null,
            //32. tworze zmienna tablicowa, która bedzie przechowywac wiele logów z gry i potem je wyświetlimy
            logMessages: []
        };
    },
    //3. tworzymy sekcję methods, czyli funkcje, które będa uruchamiane na jakiś event któy occurs in HTML code
    methods: {
        //4. zaczynamy od napisania funkcji, która ma reprezentować atakowanie potwora czyli chcemy od zdrowia potwora odjąć jakąś 
        //liczbę randomową z zadanego przedziału
        attackMonster() {
            //jedna runda to gdy my atakujemy potwora i on nas lub gdy my się leczymy to on nas atakuje
            //18. dodaje tutaj inkrmentacje tej zmiennej za każdym wykonaniem tej funkcji
            this.currentRound++;
            //5. tworzymy zmienną do której przypisujemy metodę, któa zwróci nam losową liczbę z zadanego przedziału
            //potem wskazujemy, że od zdrowia całkowitego potwora czyli od 100 hp odejmujemy tę liczbę
            //losowa liczba od 5 do 12
            const attackValue = getRandomValue(5, 12);
            this.monsterHealth -= attackValue;
            //35. dodajemy argumenty do naszej metody zaczynając od player bo my jako gracz atakujemy potwora
            //potem dajemy rodzaj akcji, czyli atak i na sammy końcu dajemy wartość tego ataku jako liczba.
            this.addLogMessage('player', 'attack', attackValue);
            //8. teraz implementujemy tę funkcję w naszej funkcji czyli jak wykona się funkcja attackMonster czyli od
            //zdrowia potwora odejmiemy randomową liczbę to wykona się również funkcja attackPlayer czyli od hp usera
            //zosanie odjęta również jakaś liczba losowa. pamiętac o tym this jak namierzamy funkcje i zmienne w obiekcie Vue
            this.attackPlayer();
        },
        //6. tworzymy teraz funkcję, która ma reprezentować to samo tylko w odniesieniu do usera
        attackPlayer() {
            //losowa liczba od 8 do 15
            //tutaj nie daje inkrementacji rundy bo tej metody nie wywołuje strikte, tylko ona łaczy się z metodą attackMonster()
            const attackValue = getRandomValue(8, 15);
            this.playerHealth -= attackValue;
            this.addLogMessage('monster', 'attack', attackValue);
        },
        //15. tworzymy funkcję ze specjalnym atakiem, czyli większe obrażenia dla potwora
        //wszystko to samo dajemy, tylko przedział zmieniamy, żeby większe liczby zwracało
        specialAttackMonster() {
            //19. dodaje tutaj inkrmentacje tej zmiennej za każdym wykonaniem tej funkcji
            this.currentRound++;
            //losowa liczba od 5 do 12
            const attackValue = getRandomValue(10, 25);
            this.monsterHealth -= attackValue;
            //36. dodajemy argumenty do naszej metody zaczynając od player bo my jako gracz atakujemy potwora
            //potem dajemy rodzaj akcji, czyli special-atak i na sammy końcu dajemy wartość tego ataku jako liczba.
            this.addLogMessage('player', 'special-attack', attackValue);
            this.attackPlayer();
        },
        //22. tworzymy metodę, która będzie dodawać nam zdrowia ale i potwór będzie nas bić jednocześnie, więc może być taka sytuacja
        //gdzie wyleczymy się za tyle co uderzy nas potwór więc będziemy na 0 finalnie.
        healPlayer() {
            //20. dodaje tutaj inkrmentacje tej zmiennej za każdym wykonaniem tej funkcji
            //to też jest runda bo jak ja się healam to monster mnie atakuje
            this.currentRound++;
            const healValue = getRandomValue(8, 20);
            if (this.playerHealth + healValue > 100) {
                this.playerHealth = 100;
            } else {
                this.playerHealth += healValue;   
            }
            //37. dodajemy argumenty do naszej metody zaczynając od player bo my jako gracz się healamy
            //potem dajemy rodzaj akcji, czyli heal i na sammy końcu dajemy wartość tego uzdrowienia jako liczba.
            this.addLogMessage('player', 'heal', healValue);
            this.attackPlayer();
        },
        //24. tworzymy metodę, która zresetuje all zmienne, i podepniemy ją do buttona w HTML start new game
        startGame() {
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.winner = null;
            this.currentRound = 0;
            this.logMessages = [];
        },
        //27. tworzymy funkcje do poddania sie czyli do zmiennej winner przypisujemy monster
        surrender() {
            this.winner = 'monster';
        },
        //33. tworzymy metodę do dodawania logów z gry. 3 parametry, kto co zrobił i jaka wartość np. heala lb obrażeń.
        //dajemy metodę unshift() aby all nowe logi pojawiały się na górze kodu.
        addLogMessage(who, what, value) {
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value
            });
        }
    },
    computed: {
        //10. tworzymy funkcję która zmieni szerokość paska zdrowia zielonego potwora
        monsterBarStyles() {
            //11. może być sytuacja, gdy na końcu odejmowania od 100 zostanie nam liczba mała np. 3 a liczba losowa do odjęcia
            //to będzie np. 5 i w takiej sytuacji nasz pasek nie zmniejszy się bo nie może odjąc 3 od 5 żeby dodatni rezultat
            //zaobserwować, dlatego robimy if statementi mówimy, że gdy zdrowie potwora będzie już < 0 to ustaw szerokość okna
            //ze zdrowiem na 0% po prostu czyli zwracamy polecenie CSS width: 'value' wartość z % dajemy w '' jak to w JS i Vue.
            //ważne są tutaj też te nawiasy sześcienne bo one obrazują że zwracamy styl jakiś a nie solo value czy coś.
            //domyślnie ta funkcja zwraca styl z szerokością paska (width) który ma wartość zdrowie potwora jako zmienna plus
            //pamiętamy o symbolu % w pojedyńczych cudzysłowiach np. zwróci nam width: 77% bo 77 to wartość po odejmowaniu od 100
            if (this.monsterHealth < 0) {
                return { width: '0%' };
            }
            return { width: this.monsterHealth + '%' };
        },
        //12. tutaj tworzymy taką samą funkcję tylko odnosimy się do paska zdrowia usera, a nie potwora. Używamy tutaj funkcji
        //computed ponieważ są to funkcje, które coś wykonują, są zależne od innych danych i nie są to typowe funkcje methods
        //które uruchamiane są jakimś eventem, tylko przekazujemy je jako wartość do paramtru w kodzie HTML bez () zawsze bo error.
        playerBarStyles() {
            if (this.playerHealth < 0) {
                return { width: '0%' };
            }
            return { width: this.playerHealth + '%' };
        },
        //21. zwracamy warunek true lub false czyli liczba rund obecna dzielona na 3 różna od 0 musi być czyli np. jak mamy 0 na starcie
        //to ono zwraca false bo daje reszte z dzielenia równą 0 czyli ta wartość nie jest różna od 0 potem mamy 1 rundę 2 i np.
        //2 dzielone na 3 zwraca nam ułamek więc się nie dzieli bez reszty ale potem mamy 3 runde i mamy 3 na 3 to 1 i dzieli się bez
        //reszty bo 0 != 0 zwraca false bo to ta sama cyfra, czyli :disabled: false czyli nie jest wyłączony button na 0 i 
        //wielokrotnościach trójki
        mayUseSpecialAttack() {
            return this.currentRound % 3 != 0;
        }
    },
    //watchery wykonują się automatycznie, ich nie bindujemy nigdzie etc.
    watch: {
        //29. robimy teraz 2 metody nadzorujące zmiany wartośći, takie same nazwy ofc i w pierwszej dajemy
        //jeżeli zdrowie gracza jest <= 0 i zdrowie potwora jest <= 0 to mamy remis czyli do zmiennej winner przypisujemy
        //stringa draw. w przeciwnym wypadku gdy wartość życia gracza jest <= 0 to zwycięzcą jest monster, wiadomo
        //jeden z nich lub remis, remis był wcześniej więc teraz któyś z nich, jeżeli user ma hp <= 0 to monster wins!
        //przypisujemy do zmiennej winner wtedy value string monster. nazwa tej metody wskazuje na zmienną playerHealth
        //a ten parametr który przekazujemy to wartośc obecna która ta zmienna przechowuje.
        playerHealth(value) {
            if (value <= 0 && this.monsterHealth <= 0) {
                //remis
                this.winner = 'draw';
            } else if (value <= 0) {
                //player lost
                this.winner = 'monster';
            } 
        },
        //30. tu robimy to samo czyli if statement z remisem, a potem drugi statement odwrotny do tego z 1 metody czyli
        //gdy wartość zmiennej monsterHealth <= 0 to wygrywa user czyli do zmiennej winner dajemy stringa player.
        monsterHealth(value) {
            if (value <= 0 && this.playerHealth <= 0) {
                //remis
                this.winner = 'draw';
            } else if (value <= 0) {
                //monster lost
                this.winner = 'player';
            }
        }
    }
}).mount('#game');
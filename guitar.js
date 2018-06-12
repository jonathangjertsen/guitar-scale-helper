class Fretboard {
    constructor(strings, numFrets) {
        this.strings = strings;
        this.numFrets = numFrets;
        this.initNotes();
    }

    initNotes() {
        this.notes = [];
        this.strings.forEach(this.addString.bind(this));
    }

    addString(string) {
        const stringNotes = [];
        const offset = Notes.findIndex(note => note === string);
        for (let index = 0; index < this.numFrets + 1; index++) {
            stringNotes.push(Notes[(offset + index) % 12]);
        }
        this.notes.push(stringNotes);
    }
}

class FretboardUi {
    constructor (fretboard, parentId) {
        this.fretboard = fretboard;
        this.parentId = parentId;
        this.initUi();
    }

    initUi() {
        this.noteElements = [];

        this.addFretboard();
        this.addFrets();
        this.addLabels();
    }

    addFretboard() {
        this.mainElement = document.createElement('div');
        this.mainElement.classList.add('fretboard');
        this.mainElement.style.gridTemplateRows = '1fr '.repeat(this.fretboard.strings.length + 1);
        this.mainElement.style.gridTemplateColumns = '1fr '.repeat(this.fretboard.numFrets + 1);
        document.getElementById(this.parentId).append(this.mainElement);
    }

    addFrets() {
        this.fretboard.notes.forEach(stringNotes => stringNotes.forEach(this.addFret.bind(this)));
    }

    addFret(note, fretNumber) {
        const fretText = document.createTextNode(note);

        const fret = document.createElement('div');
        if (fretNumber === 0) {
            fret.classList.add('string-label');
        } else {
            fret.classList.add('fret');
        }
        fret.append(fretText);
        fret.dataset.note = note;

        this.mainElement.append(fret);
        this.noteElements.push(fret);
    }

    addLabels() {
        for (let i = 0; i < this.fretboard.numFrets + 1; i++) {
            const fretLabelTextNode = document.createTextNode(this.getLabelText(i));

            const fretLabel = document.createElement('div');
            fretLabel.append(fretLabelTextNode);
            fretLabel.classList.add('fret-label');

            this.mainElement.append(fretLabel);
        }
    }

    getLabelText(fretNumber) {
        if (fretNumber === 12) {
            return "**";
        }

        if (fretNumber === 5 || fretNumber === 7 || fretNumber === 9 || fretNumber === 15 || fretNumber === 17) {
            return "*"
        }

        if (fretNumber > 0) {
            return `${fretNumber}`;
        }

        return "";
    }

    getRoot() {
        const rootSelect = document.getElementById('root-select');
        return rootSelect.options[rootSelect.selectedIndex].value;
    }

    getScale() {
        const scaleSelect = document.getElementById('scale-select');
        return scaleSelect.options[scaleSelect.selectedIndex].value;
    }

    update() {
        const root = this.getRoot();
        const rootIdx = Notes.findIndex(note => note === root);

        const scale = this.getScale();
        if (!(scale in Scales)) {
            return;
        }

        for (let noteElement of this.noteElements) {
            let inScale = false;

            let relativeIndex = (Notes.findIndex(note => note === noteElement.dataset.note) - rootIdx) % 12;
            if (relativeIndex < 0) {
                relativeIndex = 12 + relativeIndex;
            }

            for (let degree of Scales[scale]) {
                if (relativeIndex === degree) {
                    inScale = true;
                    break;
                }
            }

            if (inScale) {
                noteElement.classList.add('active-fret');
            } else {
                noteElement.classList.remove('active-fret');
            }
        }
    }
}
import LocalizedStrings from 'react-localization';

var language = new LocalizedStrings({
  /**
   * ENGLISH
   */
    en:
    {
      project:{
        name: "Colosseum"
      },
      general: {
        yes: "Yes",
        no: "No",
        edit: "Edit",
        close: "Close",
        back: "Back",
        next: "Next",
        save: "Save",
        home: "Home",
        cancel: "Cancel",
        logout: "Logout",
        profile: "Profile",
        manageUsers: "Manage Users",
        manageCenters: "Manage Centers",
        errorIncorrectData: "Insert incorrect data!",
        errorEmptyField: "Empty field!",
        errorNoConnection: "No connection",
        errorPasswordNotEquals: "Password not equals"
      },
      home: {
        title: "Title Page",
        new: "New",
        go_to_details: "Go to Profile",
        item: "items",
        search: "Search"
      },
      error: {
        generic: "An error is occurred. Please retry",
        no_user: "No user associated to the given email",
        mail_fail: "Mail send failed"
      }
    },
  /**
  * ITALIAN
  */
    it: {
      project:{
        name: "Colosseum"
      },
      general: {
        yes: "Sì",
        no: "No",
        edit: "Modifica",
        close: "Chiudi",
        back: "Indietro",
        next: "Avanti",
        save: "Salva",
        home: "Pagina Iniziale",
        cancel: "Annulla",
        profile: "Profile",
        logout: "Logout",
        manageUsers: "Gestione Utenti",
        manageCenters: "Gestione Centri",
        errorIncorrectData: "I dati inseriti non sono corretti!",
        errorEmptyField: "Alcuni campi non sono stati compilati!",
        errorNoConnection: "Nessuna connessione!",
        errorPasswordNotEquals: "Le password non corrispondono"
      },
      home: {
        title: "Titolo Pagina",
        new: "Nuovo",
        go_to_details: "Vai alla Scheda",
        item: "items",
        search: "Cerca"
      },
      error: {
        generic: "Errore. Riprovare",
        no_user: "Nessun utente associato alla mail fornita",
        mail_fail: "Errore nell'invio della mail"
      }
    }
});

export default language;
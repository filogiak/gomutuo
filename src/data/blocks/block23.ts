import { Block } from "@/types/form";

// Block 23 - La sua professione
export const block23: Block = {
  block_number: "23",
  block_id: "la_sua_professione",
  title: "La sua professione",
  priority: 1100, // Priorità aggiunta
  default_active: false,
  questions: [
    {
      question_number: "23.1",
      question_id: "categoria_professionale_coint",
      question_text: "La categoria professionale del tuo cointestatario è {{placeholder1}}",
      leads_to_placeholder_priority: "placeholder1",
      placeholders: {
        placeholder1: {
          type: "select",
          options: [
            {id: "impiegato_privato", label: "impiegato nel settore privato", leads_to: "tipo_contratto_coint", add_block: "il_suo_reddito_principale"},
            {id: "impiegato_pubblico", label: "impiegato nel settore pubblico", leads_to: "tipo_contratto_coint", add_block: "il_suo_reddito_principale"},
            {id: "lavoratore_autonomo", label: "lavoratore autonomo", leads_to: "tipo_autonomo_coint", add_block: "reddito_suo_autonomo"},
            {id: "pensionato", label: "pensionato", leads_to: "anno_pensione", add_block: "il_suo_reddito_secondario"},
            {id: "studente", label: "studente", leads_to: "periodo_studio", add_block: "il_suo_reddito_secondario"},
            {id: "disoccupato", label: "disoccupato", leads_to: "stato_disoccupazione", add_block: "il_suo_reddito_secondario"},
            {id: "altro", label: "altro", leads_to: "next_block", add_block: "il_suo_reddito_secondario"}
          ]
        }
      }
    },
    {
      question_number: "23.2",
      question_id: "tipo_contratto_coint",
      question_text: "Il suo attuale contratto è di tipo {{placeholder1}}",
      leads_to_placeholder_priority: "placeholder1",
      placeholders: {
        placeholder1: {
          type: "select",
          options: [
            {id: "indeterminato", label: "a tempo indeterminato", leads_to: "posizione_ricoperta_coint", add_block: "il_suo_reddito_secondario"},
            {id: "determinato", label: "a tempo determinato", leads_to: "scadenza_contratto_coint", add_block: "il_suo_reddito_secondario"},
            {id: "apprendistato", label: "apprendistato", leads_to: "scadenza_contratto_coint", add_block: "il_suo_reddito_secondario"},
            {id: "tirocinio", label: "tirocinio", leads_to: "scadenza_contratto_coint", add_block: "il_suo_reddito_secondario"}
          ]
        }
      }
    },
    {
      question_number: "23.3",
      question_id: "posizione_ricoperta_coint",
      question_text: "La posizione che ricopre è di {{placeholder1}}",
      leads_to_placeholder_priority: "placeholder1",
      placeholders: {
        placeholder1: {
          type: "select",
          options: [
            {id: "quadro", label: "quadro / amministratore / dirigente", leads_to: "periodo_prova_coint"},
            {id: "impiegato", label: "impiegato / operaio / altro", leads_to: "periodo_prova_coint"}
          ]
        }
      }
    },
    {
      question_number: "23.4",
      question_id: "periodo_prova_coint",
      question_text: "Il periodo di prova è {{placeholder1}}",
      leads_to_placeholder_priority: "placeholder1",
      placeholders: {
        placeholder1: {
          type: "select",
          options: [
            {id: "corso", label: "ancora in corso", leads_to: "scadenza_contratto_coint"},
            {id: "finito", label: "finito", leads_to: "next_block"}
          ]
        }
      }
    },
    {
      question_number: "23.5",
      question_id: "scadenza_contratto_coint",
      question_text: "in scadenza nel {{placeholder1}} / {{placeholder2}}",
      inline: true,
      leads_to_placeholder_priority: "placeholder2",
      placeholders: {
        placeholder1: {
          type: "input", 
          input_type: "text", 
          placeholder_label: "Mese", 
          leads_to: "probabilita_rinnovo",
          input_validation: "month"
        },
        placeholder2: {
          type: "input", 
          input_type: "number", 
          placeholder_label: "Anno", 
          leads_to: "probabilita_rinnovo",
          input_validation: "year"
        }
      }
    },
    {
      question_number: "23.6",
      question_id: "probabilita_rinnovo_coint",
      question_text: "con {{placeholder1}} possibilità di rinnovo o assunzione indeterminata",
      inline: true,
      leads_to_placeholder_priority: "placeholder1",
      placeholders: {
        placeholder1: {
          type: "select",
          options: [
            {id: "nessuna", label: "nessuna possibilità", leads_to: "next_block"},
            {id: "bassa", label: "bassa probabilità", leads_to: "next_block"},
            {id: "alta", label: "alta probabilità", leads_to: "next_block"}
          ]
        }
      }
    },
    {
      question_number: "23.7",
      question_id: "tipo_autonomo_coint",
      question_text: "La sua categoria professionale è {{placeholder1}}",
      leads_to_placeholder_priority: "placeholder1",
      placeholders: {
        placeholder1: {
          type: "select",
          options: [
            {id: "partita_iva", label: "Partita IVA", leads_to: "anno_autonomo_coint", add_block:"il_suo_reddito_secondario"},
            {id: "azienda", label: "Proprietario d'azienda", leads_to: "anno_autonomo_coint", add_block:"il_suo_reddito_secondario"},
            {id: "investitore", label: "Investitore", leads_to: "anno_autonomo_coint", add_block:"il_suo_reddito_secondario"},
            {id: "occasionale", label: "Lavoratore occasionale", leads_to: "next_block", add_block:"il_suo_reddito_secondario"},
            {id: "altro_autonomo", label: "Altro", leads_to: "input_altro_autonomo_coint", add_block:"il_suo_reddito_secondario"}
          ]
        }
      }
    },
    {
      question_number: "23.7.1",
      question_id: "input_altro_autonomo_coint",
      question_text: "Inserisci la sua professione",
      leads_to_placeholder_priority: "placeholder1",
      placeholders: {
        placeholder1: {
          type: "input",
          input_type: "text",
          placeholder_label: "Professione",
          leads_to: "anno_autonomo_coint",
          input_validation: "free_text"
        }
      }
    },
    {
      question_number: "23.8",
      question_id: "anno_autonomo_coint",
      question_text: "Il tuo cointestatario è un lavoratore autonomo dal {{placeholder1}}",
      leads_to_placeholder_priority: "placeholder1",
      placeholders: {
        placeholder1: {
          type: "input",
          input_type: "number",
          placeholder_label: "Anno",
          leads_to: "next_block",
          input_validation: "year"
        }
      }
    },
    {
      question_number: "23.9",
      question_id: "anno_pensione_coint",
      question_text: "Il tuo cointestatario è andato in pensione nel {{placeholder1}}",
      leads_to_placeholder_priority: "placeholder1",
      placeholders: {
        placeholder1: {
          type: "input",
          input_type: "number",
          placeholder_label: "Anno",
          leads_to: "reddito_pensione_coint",
          input_validation: "year",
        }
      }
    },
    {
      question_number: "23.9.1",
      question_id: "reddito_pensione_coint",
      question_text: "e percepisce una pensione mensile di {{placeholder1}}",
      leads_to_placeholder_priority: "placeholder1",
      inline: true,
      placeholders: {
        placeholder1: {
          type: "input",
          input_type: "number",
          placeholder_label: "valore",
          leads_to: "next_block",
          input_validation: "euro"
        }
      }
    },
    {
      question_number: "23.10",
      question_id: "periodo_studio_coint",
      question_text: "Il tuo cointestatario è studente dal {{placeholder1}} e finirà nel {{placeholder2}}",
      leads_to_placeholder_priority: "placeholder2",
      placeholders: {
        placeholder1: {
          type: "input", 
          input_type: "number", 
          placeholder_label: "Anno inizio", 
          leads_to: "next_block",
          input_validation: "year",
        },
        placeholder2: {
          type: "input", 
          input_type: "number", 
          placeholder_label: "Anno fine", 
          leads_to: "next_block",
          input_validation: "year",
        }
      }
    },
    {
      question_number: "23.11",
      question_id: "stato_disoccupazione_coint",
      question_text: "Il tuo cointestatario è disoccupato dal {{placeholder1}}",
      leads_to_placeholder_priority: "placeholder1",
      placeholders: {
        placeholder1: {
          type: "input", 
          input_type: "number", 
          placeholder_label: "Anno", 
          leads_to: "ricerca_lavoro",
          input_validation: "year",
        }
      }
    },
    {
      question_number: "23.12",
      question_id: "ricerca_lavoro_coint",
      question_text: "e attualmente {{placeholder1}} lavoro",
      inline: true,
      leads_to_placeholder_priority: "placeholder1",
      placeholders: {
        placeholder1: {
          type: "select",
          options: [
            {id: "sta_cercando", label: "sta cercando", leads_to: "next_block_coint"},
            {id: "non_cerca", label: "non sta cercando", leads_to: "next_block_coint"}
          ]
        }
      }
    }
  ]
};


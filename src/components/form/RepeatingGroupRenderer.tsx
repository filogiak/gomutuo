import React, { useState, useEffect } from 'react';
import { RepeatingGroupBlock, RepeatingGroupEntry } from '@/types/form';
import { IncomeManagerView } from './IncomeManagerView';
import { useRepeatingGroup } from '@/hooks/useRepeatingGroup';
import { useForm } from '@/contexts/FormContext';
import { toast } from '@/components/ui/use-toast';
import { dispatchResetEvent } from '@/utils/repeatingGroupUtils';
import { SubflowForm } from '@/components/subflow/SubflowForm';

interface RepeatingGroupRendererProps {
  block: RepeatingGroupBlock;
}

export function RepeatingGroupRenderer({ block }: RepeatingGroupRendererProps) {
  const { 
    repeating_id, 
    subflow, 
    title, 
    subtitle = "Gestisci qui tutti i tuoi redditi aggiuntivi. Puoi aggiungere, modificare o eliminare fonti di reddito.",
    empty_state_text = "Non hai ancora aggiunto nessuna fonte di reddito aggiuntiva.",
    add_button_text = "Aggiungi fonte di reddito",
    continue_button_text = "Avanti"
  } = block;
  
  const { navigateToNextQuestion, state } = useForm();
  const { addEntry, updateEntry, deleteEntry, refreshEntries, entries } = useRepeatingGroup(repeating_id);
  
  // Stato per la modalità di visualizzazione (manager o subflow)
  const [mode, setMode] = useState<'manager' | 'subflow'>('manager');
  
  // Stato per il record in corso di modifica
  const [editingEntry, setEditingEntry] = useState<{
    data: RepeatingGroupEntry;
    index: number;
  } | null>(null);
  
  // Effetto per aggiornare i dati quando il form cambia modalità o blocco
  useEffect(() => {
    // Reset mode e stati quando cambia il blocco attivo
    setMode('manager');
    setEditingEntry(null);
    
    // Forza un refresh dei dati per assicurarsi che siano aggiornati
    refreshEntries();
    
    // Controllo quando la pagina viene ricaricata o quando si naviga
    const handleBeforeUnload = () => {
      // Dispara un evento di reset quando la pagina viene ricaricata
      dispatchResetEvent();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [block.block_id, state.activeQuestion.block_id, refreshEntries]);
  
  // Gestisce l'aggiunta di un nuovo record
  const handleAdd = () => {
    setEditingEntry(null);
    setMode('subflow');
  };
  
  // Gestisce la modifica di un record esistente
  const handleEdit = (entry: RepeatingGroupEntry, index: number) => {
    setEditingEntry({ data: entry, index });
    setMode('subflow');
  };
  
  // Gestisce il completamento del subflow
  const handleSubflowComplete = (data: RepeatingGroupEntry) => {
    console.log('[RepeatingGroupRenderer] handleSubflowComplete called with data:', data);
    let success = false;
    
    if (editingEntry) {
      // Aggiorna un record esistente
      success = updateEntry(data, editingEntry.index);
      
      if (success) {
        toast({
          title: "Reddito aggiornato",
          description: "Le modifiche alla fonte di reddito sono state salvate con successo."
        });
      }
    } else {
      // Aggiunge un nuovo record
      success = addEntry(data);
      
      if (success) {
        toast({
          title: "Reddito aggiunto",
          description: "La nuova fonte di reddito è stata aggiunta con successo."
        });
      }
    }
    
    if (!success) {
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio dei dati.",
        variant: "destructive"
      });
    }
    
    // Forza un aggiornamento dei dati
    refreshEntries();
    
    // Torna alla vista manager
    setMode('manager');
    setEditingEntry(null);
  };
  
  // Gestisce l'annullamento del subflow
  const handleSubflowCancel = () => {
    setMode('manager');
    setEditingEntry(null);
  };
  
  // Gestisce la pressione del pulsante continua
  const handleContinue = () => {
    // Usa l'ID della domanda attiva corrente invece del block_id
    const currentQuestionId = state.activeQuestion.question_id;
    navigateToNextQuestion(currentQuestionId, "next_block");
  };
  
  if (mode === 'subflow') {
    return (
      <SubflowForm
        block={block}
        initialResponses={editingEntry?.data}
        onFinish={handleSubflowComplete}
        onCancel={handleSubflowCancel}
      />
    );
  }
  
  return (
    <IncomeManagerView
      repeatingId={repeating_id}
      title={title}
      subtitle={subtitle}
      emptyStateText={empty_state_text}
      addButtonText={add_button_text}
      continueButtonText={continue_button_text}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onContinue={handleContinue}
    />
  );
}

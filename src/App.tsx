import { useState } from 'react';
import type { ClientData, CreditCardInput, CreditCardResult, SimulationStep } from './types';
import { DEFAULT_ENTRY_PERCENTAGE } from './constants/financial';
import { Header } from './components/Header';
import { StepProgressBar } from './components/StepProgressBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ClientFormScreen } from './components/ClientFormScreen';
import { CreditConfigScreen } from './components/CreditConfigScreen';
import { SimulationResultScreen } from './components/SimulationResultScreen';

const initialClientData: ClientData = {
  fullName: '',
  cpf: '',
  monthlyIncome: 0,
  state: '',
  maritalStatus: '',
  spouse: undefined,
};

const initialCreditInput: CreditCardInput = {
  nominalValue: 0,
  desiredInstallment: 0,
  entryPercentage: DEFAULT_ENTRY_PERCENTAGE,
};

export default function App() {
  const [currentStep, setCurrentStep] = useState<SimulationStep>(1);
  const [client, setClient] = useState<ClientData>(initialClientData);
  const [creditInput, setCreditInput] = useState<CreditCardInput>(initialCreditInput);
  const [creditResult, setCreditResult] = useState<CreditCardResult | null>(null);
  const [simulationDate, setSimulationDate] = useState<Date>(new Date());

  // Step 1 -> Step 2
  function handleStart() {
    setCurrentStep(2);
  }

  // Step 2 -> Step 3
  function handleClientNext(data: ClientData) {
    setClient(data);
    setCurrentStep(3);
  }

  // Step 2 Back -> Step 1
  function handleClientBack() {
    setCurrentStep(1);
  }

  // Step 3 -> Step 4
  function handleCreditNext(input: CreditCardInput, result: CreditCardResult) {
    setCreditInput(input);
    setCreditResult(result);
    setSimulationDate(new Date());
    setCurrentStep(4);
  }

  // Step 3 Back -> Step 2
  function handleCreditBack() {
    setCurrentStep(2);
  }

  // Edit client from Step 3 or Step 4
  function handleEditClient() {
    setCurrentStep(2);
  }

  // Edit credit from Step 4
  function handleEditCredit() {
    setCurrentStep(3);
  }

  // Reset entire simulation (clears memory securely)
  function handleResetSimulation() {
    setClient(initialClientData);
    setCreditInput(initialCreditInput);
    setCreditResult(null);
    setCurrentStep(1);
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col font-sans">
      <Header />
      {currentStep > 1 && <StepProgressBar currentStep={currentStep} />}

      <main className="flex-1">
        {currentStep === 1 && (
          <WelcomeScreen onStart={handleStart} />
        )}

        {currentStep === 2 && (
          <ClientFormScreen
            initialData={client}
            onBack={handleClientBack}
            onNext={handleClientNext}
          />
        )}

        {currentStep === 3 && (
          <CreditConfigScreen
            client={client}
            initialInput={creditInput}
            onBack={handleCreditBack}
            onNext={handleCreditNext}
            onEditClient={handleEditClient}
          />
        )}

        {currentStep === 4 && creditResult && (
          <SimulationResultScreen
            client={client}
            creditResult={creditResult}
            simulationDate={simulationDate}
            onNewSimulation={handleResetSimulation}
            onEditClient={handleEditClient}
            onEditCredit={handleEditCredit}
          />
        )}
      </main>
    </div>
  );
}

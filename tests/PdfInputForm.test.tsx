// @vitest-environment jsdom

import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import PdfInputForm from '../src/components/PdfInputForm';
import { defaultPdfInputValues, type PdfInputValues } from '../src/utils/pdfGenerator';

vi.mock('../src/convertToImage', () => ({
  convertToImage: vi.fn(),
}));

const noOpSetter: React.Dispatch<React.SetStateAction<string>> = () => {};

const setters = {
  setInputText1: noOpSetter,
  setInputText2: noOpSetter,
  setInputText3: noOpSetter,
  setInputText4: noOpSetter,
  setInputText5: noOpSetter,
  setRentAmount: noOpSetter,
  setSecurityDeposit: noOpSetter,
  setPropertyUse: noOpSetter,
  setManagementFee: noOpSetter,
  setGovernmentRates: noOpSetter,
  setGovernmentRent: noOpSetter,
  setRentFreeFrom: noOpSetter,
  setRentFreeTo: noOpSetter,
  setBreakClause1: noOpSetter,
  setBreakClause2: noOpSetter,
  setBreakClause3: noOpSetter,
  setBreakClause3Other: noOpSetter,
  setAirConditioner: noOpSetter,
  setVentilator: noOpSetter,
  setOilVentilator: noOpSetter,
  setWaterHeater: noOpSetter,
  setGasStove: noOpSetter,
  setLightings: noOpSetter,
  setRefrigerator: noOpSetter,
  setWashingMachine: noOpSetter,
  setBed: noOpSetter,
  setWardrobe: noOpSetter,
  setSettee: noOpSetter,
  setOtherFurniture: noOpSetter,
  setLandLordId: noOpSetter,
  setLandlordTel: noOpSetter,
  setTenantId: noOpSetter,
  setTenantTel: noOpSetter,
  setLandlordBankAccount: noOpSetter,
  setBank: noOpSetter,
  setInputDate2: noOpSetter,
  setDateFrom: noOpSetter,
  setDateTo: noOpSetter,
};

const inputChangeCalls: Array<[keyof PdfInputValues, unknown, unknown]> = [];
const handleInputChange = <T extends string | number | boolean | string[]>(
  fieldName: keyof PdfInputValues,
  value: T,
  setter: React.Dispatch<React.SetStateAction<T>>,
) => {
  inputChangeCalls.push([fieldName, value, setter]);
};

const renderForm = (formValues: PdfInputValues = defaultPdfInputValues) =>
  render(
    <LanguageProvider>
      <PdfInputForm
        formValues={formValues}
        handleInputChange={handleInputChange}
        handleRemarkChange={vi.fn()}
        handleAddRemark={vi.fn()}
        handleRemoveRemark={vi.fn()}
        handleReset={vi.fn()}
        handlePreview={vi.fn()}
        handleRedirectToCheckout={vi.fn()}
        handleRedirectToReturn={vi.fn()}
        isLoading={false}
        isFreeMode={false}
        setters={setters}
      />
    </LanguageProvider>,
  );

describe('PDF input form', () => {
  afterEach(() => {
    cleanup();
    inputChangeCalls.length = 0;
    localStorage.clear();
  });

  it('renders current values and dispatches field changes with the matching setter', () => {
    renderForm({ ...defaultPdfInputValues, inputText1: 'Existing address' });

    const address = screen.getByLabelText('The Premises');
    expect((address as HTMLInputElement).value).toBe('Existing address');

    fireEvent.change(address, { target: { value: 'New address' } });

    expect(inputChangeCalls).toEqual([
      ['inputText1', 'New address', setters.setInputText1],
    ]);
  });

  it('dispatches remark edits and add/remove actions', () => {
    const handleRemarkChange = vi.fn();
    const handleAddRemark = vi.fn();
    const handleRemoveRemark = vi.fn();

    render(
      <LanguageProvider>
        <PdfInputForm
          formValues={{ ...defaultPdfInputValues, remarksFields: ['First', 'Second'] }}
          handleInputChange={handleInputChange}
          handleRemarkChange={handleRemarkChange}
          handleAddRemark={handleAddRemark}
          handleRemoveRemark={handleRemoveRemark}
          handleReset={vi.fn()}
          handlePreview={vi.fn()}
          handleRedirectToCheckout={vi.fn()}
          handleRedirectToReturn={vi.fn()}
          isLoading={false}
          isFreeMode={false}
          setters={setters}
        />
      </LanguageProvider>,
    );

    const remarks = screen.getAllByPlaceholderText('Enter remarks');
    fireEvent.change(remarks[0], { target: { value: 'Updated clause' } });
    expect(handleRemarkChange).toHaveBeenCalledWith(0, 'Updated clause');

    fireEvent.click(screen.getByRole('button', { name: '+' }));
    expect(handleAddRemark).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole('button', { name: '×' }));
    expect(handleRemoveRemark).toHaveBeenCalledWith(1);
  });
});

export default {
  editor: {
    label: { en: 'GDM Billing' },
    icon: 'file-invoice',
    customSettingsPropertiesOrder: [
      'viewMode',
      { label: 'Data', isCollapsible: true, properties: ['billingData', 'currencySymbol'] },
    ],
    customStylePropertiesOrder: [
      { label: 'Status colours', isCollapsible: true, properties: ['upcomingColor', 'issuedColor', 'completedColor'] },
      { label: 'Typography', isCollapsible: true, properties: ['fontFamily', 'fontSize', 'accentColor'] },
    ],
  },
  triggerEvents: [
    {
      name: 'onAddInvoice',
      label: { en: 'On add invoice' },
      event: { value: { title: null, type: null, status: null, invoice_number: null, invoice_reference: null, invoice_value: null, description: null, folder_link: null, einvoice_uuid: null } },
      default: true,
    },
    {
      name: 'onUpdateInvoice',
      label: { en: 'On update invoice' },
      event: { value: { id: null, title: null, type: null, status: null, invoice_number: null, invoice_reference: null, invoice_value: null, description: null, folder_link: null, einvoice_uuid: null } },
    },
    {
      name: 'onDeleteInvoice',
      label: { en: 'On delete invoice' },
      event: { value: { id: null, title: null } },
    },
    {
      name: 'onInvoiceClick',
      label: { en: 'On invoice click' },
      event: { value: { invoice: null } },
    },
  ],
  properties: {
    viewMode: {
      label: { en: 'View mode' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'admin', label: { en: 'Admin – Add / Edit / Delete' } },
          { value: 'client', label: { en: 'Client – View only' } },
        ],
      },
      defaultValue: 'admin',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: '"admin" or "client"' },
      /* wwEditor:end */
    },
    billingData: {
      label: { en: 'Billing data' },
      type: 'ObjectList',
      section: 'settings',
      bindable: true,
      defaultValue: [],
      /* wwEditor:start */
      bindingValidation: {
        type: 'array',
        tooltip: 'List of invoice objects. Each needs: id, title, status, invoice_number, invoice_value, created_at',
      },
      /* wwEditor:end */
    },
    currencySymbol: {
      label: { en: 'Currency symbol' },
      type: 'Text',
      section: 'settings',
      defaultValue: '',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { type: 'string', tooltip: 'e.g. MYR, $, £ — shown before the amount' },
      /* wwEditor:end */
    },
    upcomingColor: {
      label: { en: 'Upcoming colour' },
      type: 'Color',
      section: 'style',
      defaultValue: '#f59e0b',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Status badge colour for Upcoming' },
      /* wwEditor:end */
    },
    issuedColor: {
      label: { en: 'Issued colour' },
      type: 'Color',
      section: 'style',
      defaultValue: '#3b82f6',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Status badge colour for Issued / Pending' },
      /* wwEditor:end */
    },
    completedColor: {
      label: { en: 'Completed colour' },
      type: 'Color',
      section: 'style',
      defaultValue: '#10b981',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Status badge colour for Completed' },
      /* wwEditor:end */
    },
    fontFamily: {
      label: { en: 'Font family' },
      type: 'FontFamily',
      section: 'style',
      defaultValue: 'DM Sans, system-ui, sans-serif',
      bindable: true,
    },
    fontSize: {
      label: { en: 'Base font size' },
      type: 'Length',
      section: 'style',
      options: { unitChoices: [{ value: 'px', label: 'px', min: 12, max: 20 }] },
      defaultValue: '15px',
      bindable: true,
      responsive: true,
    },
    accentColor: {
      label: { en: 'Accent colour' },
      type: 'Color',
      section: 'style',
      defaultValue: '#0d9488',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Used for type pills, admin badge, button' },
      /* wwEditor:end */
    },
  },
};

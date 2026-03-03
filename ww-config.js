export default {
  editor: {
    label: { en: 'GDM Billing' },
    icon: 'file',
    customSettingsPropertiesOrder: [
      'viewMode',
      { label: 'Data', isCollapsible: true, properties: ['billingData', 'idFormula', 'titleFormula', 'typeFormula', 'statusFormula', 'invoiceNumberFormula', 'invoiceReferenceFormula', 'invoiceValueFormula', 'createdAtFormula'] },
      { label: 'Labels', isCollapsible: true, properties: ['upcomingLabel', 'pendingLabel', 'completedLabel', 'emptyLabel'] },
    ],
    customStylePropertiesOrder: [
      { label: 'Layout', isCollapsible: true, properties: ['layoutMode', 'cardBackgroundColor', 'cardBorderRadius', 'cardPadding'] },
      { label: 'Status colors', isCollapsible: true, properties: ['upcomingAccentColor', 'pendingAccentColor', 'completedAccentColor'] },
      { label: 'Typography', isCollapsible: true, properties: ['fontFamily', 'fontSize', 'sectionHeaderColor', 'accentColor'] },
    ],
  },
  triggerEvents: [
    {
      name: 'onInvoiceClick',
      label: { en: 'On invoice click' },
      event: { value: { invoice: null } },
      default: true,
    },
    {
      name: 'onDeleteInvoice',
      label: { en: 'On delete invoice (admin)' },
      event: { value: { id: null, title: null } },
    },
  ],
  properties: {
    viewMode: {
      label: { en: 'View mode' },
      type: 'TextSelect',
      section: 'settings',
      options: {
        options: [
          { value: 'admin', label: { en: 'Admin – Full details + actions' } },
          { value: 'client', label: { en: 'Client – Clean read-only view' } },
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
      bindingValidation: { type: 'array', tooltip: 'List of billing/invoice rows from Supabase' },
      /* wwEditor:end */
    },
    idFormula: {
      label: { en: 'ID field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.billingData) && content.billingData.length > 0 ? content.billingData[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['id'] ?? context.id ?? ''" },
      hidden: (content, sidepanelContent, boundProps) => !boundProps?.billingData,
    },
    titleFormula: {
      label: { en: 'Title field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.billingData) && content.billingData.length > 0 ? content.billingData[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['title'] ?? context.title ?? ''" },
      hidden: (content, sidepanelContent, boundProps) => !boundProps?.billingData,
    },
    typeFormula: {
      label: { en: 'Type field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.billingData) && content.billingData.length > 0 ? content.billingData[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['type'] ?? context.type ?? ''" },
      hidden: (content, sidepanelContent, boundProps) => !boundProps?.billingData,
    },
    statusFormula: {
      label: { en: 'Status field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.billingData) && content.billingData.length > 0 ? content.billingData[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['status'] ?? context.status ?? ''" },
      hidden: (content, sidepanelContent, boundProps) => !boundProps?.billingData,
    },
    invoiceNumberFormula: {
      label: { en: 'Invoice number field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.billingData) && content.billingData.length > 0 ? content.billingData[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['invoice_number'] ?? context.invoice_number ?? ''" },
      hidden: (content, sidepanelContent, boundProps) => !boundProps?.billingData,
    },
    invoiceReferenceFormula: {
      label: { en: 'Invoice reference field (admin only)' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.billingData) && content.billingData.length > 0 ? content.billingData[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['invoice_reference'] ?? context.invoice_reference ?? ''" },
      hidden: (content, sidepanelContent, boundProps) => !boundProps?.billingData,
    },
    invoiceValueFormula: {
      label: { en: 'Invoice value field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.billingData) && content.billingData.length > 0 ? content.billingData[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['invoice_value'] ?? context.invoice_value ?? 0" },
      hidden: (content, sidepanelContent, boundProps) => !boundProps?.billingData,
    },
    createdAtFormula: {
      label: { en: 'Date field' },
      type: 'Formula',
      section: 'settings',
      options: (content) => ({
        template: Array.isArray(content.billingData) && content.billingData.length > 0 ? content.billingData[0] : null,
      }),
      defaultValue: { type: 'f', code: "context.mapping?.['created_at'] ?? context.created_at ?? ''" },
      hidden: (content, sidepanelContent, boundProps) => !boundProps?.billingData,
    },
    upcomingLabel: {
      label: { en: 'Upcoming section label' },
      type: 'Text',
      section: 'settings',
      multilang: true,
      defaultValue: 'Upcoming',
      bindable: true,
    },
    pendingLabel: {
      label: { en: 'Pending section label' },
      type: 'Text',
      section: 'settings',
      multilang: true,
      defaultValue: 'Pending',
      bindable: true,
    },
    completedLabel: {
      label: { en: 'Completed section label' },
      type: 'Text',
      section: 'settings',
      multilang: true,
      defaultValue: 'Completed',
      bindable: true,
    },
    emptyLabel: {
      label: { en: 'Empty state text' },
      type: 'Text',
      section: 'settings',
      multilang: true,
      defaultValue: 'No invoices',
      bindable: true,
    },
    layoutMode: {
      label: { en: 'Layout' },
      type: 'TextSelect',
      section: 'style',
      options: {
        options: [
          { value: 'columns', label: { en: 'Three columns' } },
          { value: 'stacked', label: { en: 'Stacked sections' } },
        ],
      },
      defaultValue: 'columns',
    },
    cardBackgroundColor: {
      label: { en: 'Card background' },
      type: 'Color',
      section: 'style',
      defaultValue: '#ffffff',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Card background' },
      /* wwEditor:end */
    },
    cardBorderRadius: {
      label: { en: 'Card border radius' },
      type: 'Length',
      section: 'style',
      options: { unitChoices: [{ value: 'px', label: 'px', min: 0, max: 24 }] },
      defaultValue: '10px',
      bindable: true,
    },
    cardPadding: {
      label: { en: 'Card padding' },
      type: 'Length',
      section: 'style',
      options: { unitChoices: [{ value: 'px', label: 'px', min: 0, max: 32 }] },
      defaultValue: '16px',
      bindable: true,
    },
    upcomingAccentColor: {
      label: { en: 'Upcoming color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#f59e0b',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Upcoming accent' },
      /* wwEditor:end */
    },
    pendingAccentColor: {
      label: { en: 'Pending color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#3b82f6',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Pending accent' },
      /* wwEditor:end */
    },
    completedAccentColor: {
      label: { en: 'Completed color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#10b981',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Completed accent' },
      /* wwEditor:end */
    },
    accentColor: {
      label: { en: 'Link / action color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#0d9488',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Accent color for links and actions' },
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
      label: { en: 'Font size' },
      type: 'Length',
      section: 'style',
      options: { unitChoices: [{ value: 'px', label: 'px', min: 12, max: 20 }] },
      defaultValue: '15px',
      bindable: true,
      responsive: true,
    },
    sectionHeaderColor: {
      label: { en: 'Section header color' },
      type: 'Color',
      section: 'style',
      defaultValue: '#1e293b',
      bindable: true,
      /* wwEditor:start */
      bindingValidation: { cssSupports: 'color', type: 'string', tooltip: 'Section title color' },
      /* wwEditor:end */
    },
  },
};

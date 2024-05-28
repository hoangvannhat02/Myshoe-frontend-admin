import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CkeditorService {

  constructor() { }

  ckeditorConfig = {
    toolbar: [
      { name: 'document', items: ['Source', '-', 'NewPage', 'Preview', '-', 'Templates'] },
      { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
      { name: 'insert', items: ['Image', 'Table', 'HorizontalRule', 'SpecialChar'] },
      '/',
      { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
      { name: 'styles', items: ['Styles', 'Format'] },
      { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
      { name: 'links', items: ['Link', 'Unlink'] },
      { name: 'tools', items: ['Maximize'] },
      { name: 'editing', items: ['Find', 'Replace', '-', 'SelectAll'] },
      { name: 'document', items: ['Print', '-'] },
      { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
    ],
  }
}

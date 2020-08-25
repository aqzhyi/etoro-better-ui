import { GM } from '~/GM'

/**
 * Auto-scaling the execution dialog window to suitable who using the smaller screen
 */
GM.addStyle(`
  @media (max-height:755px) {
    .uidialog-content {
      transform: scale(0.9);
    }
  }

  @media (max-height:655px) {
    .uidialog-content {
      transform: scale(0.7);
    }
  }

  @media (max-height:555px) {
    .uidialog-content {
      transform: scale(0.6);
    }
  }

  @media (max-height:455px) {
    .uidialog-content {
      transform: scale(0.4);
    }
  }
`)

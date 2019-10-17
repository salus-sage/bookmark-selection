// import { describeTextQuote } from '@annotator/dom';
import { makeRemotelyCallable } from 'webextension-rpc';

// Minimal implementation
function describeTextQuote(range) {
  return {
    type: 'TextQuoteSelector',
    exact: range.toString(),
  };
}

function describeSelection() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const selector = describeTextQuote(range);
  return selector;
}

makeRemotelyCallable({
  describeSelection,
});

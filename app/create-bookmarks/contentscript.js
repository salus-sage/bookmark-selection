import { describeTextQuote } from '@annotator/dom';
import { makeRemotelyCallable } from 'webextension-rpc';

function describeSelection() {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  const selector = describeTextQuote(range);
  return selector;
}

makeRemotelyCallable({
  describeSelection,
});

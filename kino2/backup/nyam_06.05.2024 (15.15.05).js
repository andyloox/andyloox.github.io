(function() {
  'use strict';

  var unic_id = Lampa.Storage.get('sisi_unic_id', '');
  var network = new Lampa.Reguest();

  network.silent('https://vi.sisi.am/api/unfo?box_mac=' + unic_id, function(json) {
    if (json.access) {
      Lampa.Utils.putScriptAsync([json.p], function() {});
    }
  });
  
})();
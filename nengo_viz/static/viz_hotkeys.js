VIZ.Hotkeys = function () { 
    var self = this;

    document.addEventListener('keypress', function(ev) {
        // undo with ctrl-z
        if (ev.ctrlKey == true && ev.keyCode == 90) {
            VIZ.netgraph.notify({ undo: "1" });
        }
        // redo with shift-ctrl-z
        if (ev.ctrlKey == true && ev.shiftKey == true && ev.keyCode == 90) {
            VIZ.netgraph.notify({ undo: "0" });
        }
        // redo with ctrl-y
        if (ev.ctrlKey == true && ev.keyCode == 89) {
            VIZ.netgraph.notify({ undo: "0" });
        }
        // run model with spacebar
        if (ev.keyCode == 32) {
            sim.on_pause_click();
        }
        // bring up help menu with ? 
        if (ev.shiftKey && ev.keyCode == 63) {
            self.callMenu();
        }
        console.log(ev.keyCode);
    });
}

VIZ.Hotkeys.prototype.callMenu = function () {
        VIZ.modal.title("Hotkeys list");
        VIZ.modal.help_body();
        VIZ.modal.show();
}

VIZ.hotkeys = new VIZ.Hotkeys();

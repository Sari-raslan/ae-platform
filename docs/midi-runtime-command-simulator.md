# MIDI Runtime Command Simulator

Adds safe simulated MIDI-to-runtime command mapping:

- note 60 → start
- note 61 → stop
- note 62 → status
- other note-on → style switch
- control-change → tempo command

This avoids requiring real MIDI hardware while preparing real runtime command binding.

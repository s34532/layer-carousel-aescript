{
  function createCarouselUI() {
    var dialog = new Window("dialog", "3D Carousel Settings");

    // Radius setting
    dialog.add("statictext", undefined, "Carousel Radius:");
    var radiusInput = dialog.add("edittext", undefined, "500");
    radiusInput.characters = 5;

    // Face direction
    dialog.add("statictext", undefined, "Face direction:");
    var orientationGroup = dialog.add("group");
    var inwardRadioButton = orientationGroup.add(
      "radiobutton",
      undefined,
      "Inward"
    );
    var outwardRadioButton = orientationGroup.add(
      "radiobutton",
      undefined,
      "Outward"
    );
    outwardRadioButton.value = true; // Default to outward

    // Buttons
    var buttonGroup = dialog.add("group");
    buttonGroup.alignment = "center";
    var okButton = buttonGroup.add("button", undefined, "OK");
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");

    // Event handlers
    okButton.onClick = function () {
      var radius = parseFloat(radiusInput.text);
      if (isNaN(radius) || radius <= 0) {
        alert("Please enter a valid positive number for the radius.");
        return;
      }
      var faceInward = inwardRadioButton.value;
      dialog.close();
      create3DCarousel(radius, faceInward);
    };

    cancelButton.onClick = function () {
      dialog.close();
    };

    dialog.show();
  }

  function create3DCarousel(radius, faceInward) {
    app.beginUndoGroup("Create 3D Carousel");

    var comp = app.project.activeItem;

    if (comp instanceof CompItem && comp.selectedLayers.length > 1) {
      var layers = comp.selectedLayers;
      var numLayers = layers.length;
      var angleIncrement = 360 / numLayers;

      // Get the center of the composition
      var compCenter = [comp.width / 2, comp.height / 2, 0];

      for (var i = 0; i < numLayers; i++) {
        var layer = layers[i];
        layer.threeDLayer = true;

        // Calculate the position
        var angle = angleIncrement * i;
        var radians = (angle * Math.PI) / 180;
        var x = radius * Math.cos(radians);
        var z = radius * Math.sin(radians);
        var y = 0; // Keep y at the center of the comp

        var newPosition = [compCenter[0] + x, compCenter[1] + y, z];
        layer.position.setValue(newPosition);

        // Calculate the orientation
        var newOrientation = faceInward
          ? inward(compCenter, newPosition)
          : outward(compCenter, newPosition);

        layer.property("orientation").setValue(newOrientation);
      }

      alert("3D Carousel created successfully!");
    } else {
      alert("Please select more than one layer.");
    }

    app.endUndoGroup();
  }

  function inward(target, position) {
    var dx = target[0] - position[0];
    var dy = target[1] - position[1];
    var dz = target[2] - position[2];

    var yaw = (Math.atan2(dx, dz) * 180) / Math.PI;
    var pitch = (-Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * 180) / Math.PI;

    return [pitch, yaw, 0];
  }

  function outward(target, position) {
    var dx = target[0] - position[0];
    var dy = target[1] - position[1];
    var dz = target[2] - position[2];

    var yaw = (Math.atan2(dx, dz) * 180) / Math.PI;
    var pitch = (-Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * 180) / Math.PI;

    return [pitch, yaw + 90, 0];
  }

  createCarouselUI();
}

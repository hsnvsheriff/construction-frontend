export function openWallEditModal(wallLine, onClose = () => {}) {
    const modal = document.createElement('div');
    modal.innerHTML = `
      <div style="position:fixed;top:20%;left:50%;transform:translateX(-50%);
                  background:white;padding:20px;border:1px solid #ccc;
                  font-family:sans-serif;z-index:10000">
        <h3>Edit Wall</h3>
        <label>Thickness: <input id="wall-thickness" type="number" value="${wallLine.customProps?.thickness || 30}" /></label><br/><br/>
        <label>Height: <input id="wall-height" type="number" value="${wallLine.customProps?.height || 280}" /></label><br/><br/>
        <label>Code: <input id="wall-code" type="text" value="${wallLine.customProps?.code || ''}" /></label><br/><br/>
        <button id="apply-wall-btn">Apply</button>
      </div>
    `;
    document.body.appendChild(modal);
  
    document.getElementById('apply-wall-btn').onclick = () => {
      const thickness = parseFloat(document.getElementById('wall-thickness').value);
      const height = parseFloat(document.getElementById('wall-height').value);
      const code = document.getElementById('wall-code').value;
  
      wallLine.customProps = { thickness, height, code };
      document.body.removeChild(modal);
      onClose();
    };
  }
  
<div class="footer">
  <div class="status"><slot name="status" /></div>
  <div class="action"><slot name="action" /></div>
</div>

<style>
  .footer {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 20px;
    border-top: 1px solid var(--window-border);
  }
  .status {
    flex: 1;
    min-width: 0;
    font: 400 12.5px/1.5 var(--font-ui);
    color: var(--text-dim);
  }
  .status :global(b) {
    color: var(--text-body);
    font-weight: 600;
  }
  .action {
    display: flex;
    align-items: center;
    gap: 10px;
  }
</style>

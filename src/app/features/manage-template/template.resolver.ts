import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Template } from '@core/models/template.model';
import { TemplateService } from '@features/manage-template/services/template.service';

export const templateResolver: ResolveFn<Template | null> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const templateService = inject(TemplateService);
  const id = Number(route.paramMap.get('id'));
  return templateService.getTemplateById(+id);
};

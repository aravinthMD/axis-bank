import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { UserService } from "src/app/shared/services/user.service";
import { ToasterService } from "src/app/shared/services/toaster.service";
import {
  BUTTON_TEXTS,
  ROLES,
  PAGES,
  MENU_TITLES,
} from "src/app/shared/utils/constant";

@Component({
  selector: "app-user-creation",
  templateUrl: "./user-creation.component.html",
  styleUrls: ["./user-creation.component.scss"],
})
export class UserCreationComponent implements OnInit {
  submitButtonText = BUTTON_TEXTS.SUBMIT_BUTTON_TEXT;

  loading = false;
  superAdminForm: FormGroup;
  adminForm: FormGroup;

  currentUserRole: string;
  userRoles: string[] = [ROLES.ADMIN, ROLES.USER];
  userOptions = [
    {
      title: MENU_TITLES.VIEW_WHATSAPP,
      routerPath: PAGES.VIEW_WHATSAPP,
      value: 1,
    },
    {
      title: MENU_TITLES.BLOCK_WHATSAPP,
      routerPath: PAGES.BLOCK_WHATSAPP,
      value: 2,
    },
    {
      title: MENU_TITLES.MARKETING_MAKER,
      routerPath: PAGES.MARKETING_MAKER,
      value: 3,
    },
    {
      title: MENU_TITLES.MARKETING_CHECKER,
      routerPath: PAGES.MARKETING_CHECKER,
      value: 4,
    },
  ];

  selectedMenuList = [];

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toasterService: ToasterService
  ) {
    this.superAdminForm = this.formBuilder.group({
      userId: ["", [Validators.required]],
      userRole: [ROLES.ADMIN, Validators.required],
      accessMenus: [""],
    });

    this.adminForm = this.formBuilder.group({
      userId: ["", [Validators.required]],
      userRole: [ROLES.USER],
      accessMenus: ["", Validators.required],
    });
    this.currentUserRole = this.userService.currentUserValue.role;
  }

  ngOnInit(): void {}

  onRoleChanged(): void {
    const selectedRole = this.superAdminFieldControls.userRole.value;
    if (selectedRole === ROLES.USER) {
      const accessMenus = this.superAdminFieldControls.accessMenus;
      accessMenus.setValidators(Validators.required);
      this.superAdminForm.updateValueAndValidity();
    } else {
      const accessMenus = this.superAdminFieldControls.accessMenus;
      accessMenus.setValidators(null);
      this.superAdminForm.updateValueAndValidity();
    }
    this.superAdminForm.patchValue({
      accessMenus: null,
    });
    this.selectedMenuList = [];
  }

  get superAdminFieldControls() {
    return this.superAdminForm.controls;
  }

  get adminFieldControls() {
    return this.adminForm.controls;
  }

  onChange(event: any, option: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedMenuList.push(option.value);
    } else {
      const index = this.selectedMenuList.findIndex(
        (menuValue) => menuValue === option.value
      );
      this.selectedMenuList.splice(index, 1);
    }
    this.validate();
  }

  validate(): void {
    const maker = this.selectedMenuList.find((item) => item === 3);
    const checker = this.selectedMenuList.find((item) => item === 4);
    const makerElement = document.getElementById(MENU_TITLES.MARKETING_MAKER);
    const checkerElement = document.getElementById(
      MENU_TITLES.MARKETING_CHECKER
    );
    if (maker && !checker) {
      checkerElement.setAttribute("disabled", "true");
    } else if (checker && !maker) {
      makerElement.setAttribute("disabled", "true");
    } else {
      makerElement.removeAttribute("disabled");
      checkerElement.removeAttribute("disabled");
    }
  }

  createUser(): void {
    this.loading = true;
    if (this.currentUserRole === ROLES.SUPER_ADMIN) {
      const userId = this.superAdminFieldControls.userId.value;
      const userRole = this.superAdminFieldControls.userRole.value;
      if (userRole === ROLES.USER) {
        console.log(userId, userRole, this.selectedMenuList);
      } else {
        console.log(userId, userRole);
      }
      this.loading = false;
    } else {
      const userId = this.adminFieldControls.userId.value;
      const userRole = this.adminFieldControls.userRole.value;
      console.log(userId, userRole, this.selectedMenuList);
      this.loading = false;
    }
  }
}
